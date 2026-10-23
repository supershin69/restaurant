#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/60af20800c71202829faeed640e15815a55378c9547aa4e7501b569e0cc8bbee/contract';
import startContract from '../../snapshots/60af20800c71202829faeed640e15815a55378c9547aa4e7501b569e0cc8bbee/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b5f94c85f7852cf93c85d1598e1aa3e6ab4ae965f7b246395087bf5767bd9055/contract';
import endContract from '../../snapshots/b5f94c85f7852cf93c85d1598e1aa3e6ab4ae965f7b246395087bf5767bd9055/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Profile' }),
      this.createTable({
        schema: 'public',
        table: 'profiles',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('profile_image', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('WAITER'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'profiles_role_check_edcfd911',
            sql`"role" IN ('OWNER', 'MANAGER', 'COOK', 'WAITER')`,
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'profiles',
        constraint: 'profiles_user_id_key',
        columns: ['user_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'profiles',
        foreignKey: {
          name: 'profiles_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
