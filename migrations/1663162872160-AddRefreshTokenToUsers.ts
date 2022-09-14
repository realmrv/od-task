import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenToUsers1663162872160 implements MigrationInterface {
  name = 'AddRefreshTokenToUsers1663162872160';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refreshToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
  }
}
