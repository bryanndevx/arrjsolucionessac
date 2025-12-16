import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, MoreThan } from 'typeorm'
import { Order } from './order.entity'
import { OrderItem } from './order-item.entity'
import { CreateOrderDto } from './dto/create-order.dto'
import { Inventory } from '../inventory/inventory.entity'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      customerName: dto.customerName,
      email: dto.email,
      phone: dto.phone,
      company: dto.company,
      message: dto.message,
      total: dto.total,
      type: dto.type as any,
      status: 'pending',
      items: dto.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        productType: item.productType
      }))
    })

    return await this.orderRepository.save(order)
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      order: { createdAt: 'DESC' }
    })
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } })
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return order
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    const order = await this.findOne(id)
    order.status = status as any
    return await this.orderRepository.save(order)
  }

  async getStats() {
    const orders = await this.orderRepository.find()
    const inventories = await this.inventoryRepository.find()

    // Alquileres activos (type=rental y status in_progress o accepted)
    const activeRentals = orders.filter(
      o => o.type === 'rental' && (o.status === 'in_progress' || o.status === 'accepted')
    ).length

    // Ventas del mes actual (TODAS las ventas, sin importar el estado)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const salesThisMonth = orders.filter(
      o => o.type === 'sale' && 
           new Date(o.createdAt) >= startOfMonth &&
           o.status !== 'cancelled' // Excluir solo las canceladas
    )
    const salesTotal = salesThisMonth.reduce((sum, o) => sum + Number(o.total), 0)
    const salesCount = salesThisMonth.length

    // Solicitudes pendientes (cualquier tipo con status pending)
    const pendingRequests = orders.filter(o => o.status === 'pending').length

    // Equipos disponibles (tipos únicos de productos con stock > 0)
    const availableEquipment = inventories.filter(i => i.stockActual > 0).length

    // Total de inventario (suma de todas las unidades)
    const totalInventory = inventories.reduce((sum, i) => sum + i.stockActual, 0)

    // Equipos en uso (suma de items de alquileres activos)
    const equipmentInUse = orders
      .filter(o => o.type === 'rental' && (o.status === 'in_progress' || o.status === 'accepted'))
      .reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)

    // Total de órdenes completadas este mes
    const completedOrdersThisMonth = orders.filter(
      o => new Date(o.createdAt) >= startOfMonth && o.status === 'completed'
    ).length

    return {
      activeRentals,
      salesThisMonth: {
        total: salesTotal,
        count: salesCount,
        average: salesCount > 0 ? salesTotal / salesCount : 0
      },
      pendingRequests,
      availableEquipment,
      totalInventory,
      equipmentInUse,
      totalProducts: inventories.length,
      completedOrdersThisMonth
    }
  }

  async getReportData(type: string, dateFrom?: string, dateTo?: string) {
    const orders = await this.orderRepository.find()
    const inventories = await this.inventoryRepository.find()

    // Filtrar por fechas si se proporcionan (o usar todas si no hay filtros)
    let filteredOrders = orders
    if (dateFrom && dateTo) {
      const from = new Date(dateFrom + 'T00:00:00.000Z')
      const to = new Date(dateTo + 'T23:59:59.999Z')
      
      filteredOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt)
        return orderDate >= from && orderDate <= to
      })
    }

    // Calcular estadísticas según el tipo de reporte
    if (type === 'sales') {
      // Incluir TODAS las ventas excepto las canceladas
      const sales = filteredOrders.filter(o => o.type === 'sale' && o.status !== 'cancelled')
      const total = sales.reduce((sum, o) => sum + Number(o.total), 0)
      const count = sales.length
      const average = count > 0 ? total / count : 0

      // Desglose por mes
      const monthlyData = sales.reduce((acc, order) => {
        const month = new Date(order.createdAt).toLocaleString('es-PE', { month: 'short', year: 'numeric' })
        if (!acc[month]) {
          acc[month] = { count: 0, total: 0 }
        }
        acc[month].count++
        acc[month].total += Number(order.total)
        return acc
      }, {} as Record<string, { count: number; total: number }>)

      // Desglose por estado
      const byStatus = {
        pending: sales.filter(o => o.status === 'pending').length,
        quoted: sales.filter(o => o.status === 'quoted').length,
        accepted: sales.filter(o => o.status === 'accepted').length,
        in_progress: sales.filter(o => o.status === 'in_progress').length,
        completed: sales.filter(o => o.status === 'completed').length
      }

      return {
        type: 'sales',
        summary: { total, count, average },
        byStatus,
        monthlyData,
        orders: sales.map(o => ({
          id: o.id,
          customer: o.customerName,
          date: o.createdAt,
          total: o.total,
          status: o.status
        }))
      }
    }

    if (type === 'rentals') {
      const rentals = filteredOrders.filter(o => o.type === 'rental')
      const active = rentals.filter(o => o.status === 'in_progress' || o.status === 'accepted').length
      const completed = rentals.filter(o => o.status === 'completed').length
      const total = rentals.reduce((sum, o) => sum + Number(o.total), 0)
      
      const equipmentInUse = rentals
        .filter(o => o.status === 'in_progress' || o.status === 'accepted')
        .reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)

      return {
        type: 'rentals',
        summary: {
          active,
          completed,
          total,
          equipmentInUse,
          available: inventories.filter(i => i.stockActual > 0).length
        },
        orders: rentals.map(o => ({
          id: o.id,
          customer: o.customerName,
          date: o.createdAt,
          total: o.total,
          status: o.status,
          equipment: o.items.map(item => item.productName).join(', ')
        }))
      }
    }

    if (type === 'inventory') {
      const totalUnits = inventories.reduce((sum, i) => sum + i.stockActual, 0)
      const totalProducts = inventories.length
      const withStock = inventories.filter(i => i.stockActual > 0).length
      const lowStock = inventories.filter(i => i.stockActual > 0 && i.stockActual <= i.stockMinimo).length

      return {
        type: 'inventory',
        summary: {
          totalUnits,
          totalProducts,
          withStock,
          lowStock
        },
        items: inventories.map(inv => ({
          id: inv.id,
          productId: inv.productoId,
          stock: inv.stockActual,
          minStock: inv.stockMinimo,
          location: inv.ubicacion,
          status: inv.stockActual <= inv.stockMinimo ? 'low' : 'ok'
        }))
      }
    }

    return { type, summary: {}, data: [] }
  }
}
