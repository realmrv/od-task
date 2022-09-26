import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTags1664181337487 implements MigrationInterface {
  name = 'CreateTags1664181337487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', "creator" uuid, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ADD CONSTRAINT "FK_82c362f67992ac458a09fd5f1e7" FOREIGN KEY ("creator") REFERENCES "users"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tags" DROP CONSTRAINT "FK_82c362f67992ac458a09fd5f1e7"`,
    );
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
