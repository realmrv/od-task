import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTags1664181480837 implements MigrationInterface {
  name = 'CreateUsersTags1664181480837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_tags" ("userUid" uuid NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_421dd87f0367ee025402816f994" PRIMARY KEY ("userUid", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_42eb3e1a78c30563fa6e82f213" ON "users_tags" ("userUid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_619db871b62b3bd23be01810df" ON "users_tags" ("tagId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users_tags" ADD CONSTRAINT "FK_42eb3e1a78c30563fa6e82f2133" FOREIGN KEY ("userUid") REFERENCES "users"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_tags" ADD CONSTRAINT "FK_619db871b62b3bd23be01810dff" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_tags" DROP CONSTRAINT "FK_619db871b62b3bd23be01810dff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_tags" DROP CONSTRAINT "FK_42eb3e1a78c30563fa6e82f2133"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_619db871b62b3bd23be01810df"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_42eb3e1a78c30563fa6e82f213"`,
    );
    await queryRunner.query(`DROP TABLE "users_tags"`);
  }
}
