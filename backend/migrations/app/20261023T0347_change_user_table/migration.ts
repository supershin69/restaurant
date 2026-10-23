#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/a89401a27d2ce734675aa6a4d74a3591cd67f22c66fb90ca3a404ac5592d5f68/contract';
import endContract from '../../snapshots/a89401a27d2ce734675aa6a4d74a3591cd67f22c66fb90ca3a404ac5592d5f68/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b5f94c85f7852cf93c85d1598e1aa3e6ab4ae965f7b246395087bf5767bd9055/contract';
import startContract from '../../snapshots/b5f94c85f7852cf93c85d1598e1aa3e6ab4ae965f7b246395087bf5767bd9055/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'profiles',
        constraint: 'profiles_role_check_edcfd911',
      }),
      this.dropColumn({ schema: 'public', table: 'profiles', column: 'role' }),
      this.addColumn({
        schema: 'public',
        table: 'users',
        column: col('role', 'text', {
          notNull: true,
          default: lit('WAITER'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'users',
        constraint: 'users_role_check_edcfd911',
        expression: sql`"role" IN ('OWNER', 'MANAGER', 'COOK', 'WAITER')`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
