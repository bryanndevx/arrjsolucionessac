import { Injectable, OnModuleInit } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class SqliteInitService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Enable WAL mode to improve concurrency
      await this.dataSource.query("PRAGMA journal_mode = WAL;")
      // Set busy timeout (ms)
      await this.dataSource.query("PRAGMA busy_timeout = 60000;")
      console.log('SQLite PRAGMA applied: journal_mode=WAL, busy_timeout=60000')
    } catch (err) {
      console.warn('Could not set SQLite pragmas:', err?.message || err)
    }
  }
}
