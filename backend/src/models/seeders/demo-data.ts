import { QueryInterface, Sequelize } from "sequelize/types";
// import { User } from "../models/User";
import { Category } from "../Category";
import { Post } from "../Post";
import { Tag } from "../Tag";
import { Comment } from "../Comment";
import { Token } from "../Token";
import { PostTag } from "../PostTag";
import { User } from "../User";

export class DemoDataSeeder {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const users: User[] = (await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Jan Kowalski",
          email: "jan@example.com",
          password: "hashed_password!@#HASH", // Upewnij się, że hasło jest haszowane
          status: "active",
        },
        {
          name: "Anna Nowak",
          email: "anna@example.com",
          password: "hashed_password!@#HASH",
          status: "active",
        },
      ],
      {}
    )) as User[];

    const categories: Category[] = (await queryInterface.bulkInsert(
      "Categories",
      [
        { name: "Programowanie", slug: "programowanie", userId: users[0].id },
        { name: "Podróże", slug: "podroze", userId: users[1].id },
      ],
      {}
    )) as Category[];

    const tags: Tag[] = (await queryInterface.bulkInsert(
      "Tags",
      [
        { name: "JavaScript", slug: "javascript", userId: users[0].id },
        { name: "TypeScript", slug: "typescript", userId: users[0].id },
      ],
      {}
    )) as Tag[];

    const posts: Post[] = (await queryInterface.bulkInsert(
      "Posts",
      [
        {
          title: "Moje pierwsze posty",
          content: "Treść mojego pierwszego posta...",
          slug: "moje-pierwsze-posty",
          userId: users[0].id,
          categoryId: categories[0].id,
        },
        {
          title: "Podróże po Europie",
          content: "Treść mojego drugiego posta...",
          slug: "podroze-po-europie",
          userId: users[1].id,
          categoryId: categories[1].id,
        },
      ],
      {}
    )) as Post[];

    (await queryInterface.bulkInsert(
      "Comments",
      [
        {
          content: "Świetny post!",
          userId: users[1].id,
          postId: posts[0].id,
        },
      ],
      {}
    )) as Comment[];

    (await queryInterface.bulkInsert(
      "PostTags",
      [
        {
          postId: posts[0].id,
          tagId: tags[0].id,
        },
        {
          postId: posts[0].id,
          tagId: tags[1].id,
        },
        {
          postId: posts[1].id,
          tagId: tags[1].id,
        },
      ],
      {}
    )) as PostTag[];

    (await queryInterface.bulkInsert(
      "Tokens",
      [
        {
          token: "example_token_1",
          userId: users[0].id,
          type: "activation",
        },
        {
          token: "example_token_2",
          userId: users[1].id,
          type: "reset",
        },
      ],
      {}
    )) as Token[];
  }

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.bulkDelete("Tokens", {}, {});
    await queryInterface.bulkDelete("Comments", {}, {});
    await queryInterface.bulkDelete("PostTags", {}, {});
    await queryInterface.bulkDelete("Posts", {}, {});
    await queryInterface.bulkDelete("Tags", {}, {});
    await queryInterface.bulkDelete("Categories", {}, {});
    await queryInterface.bulkDelete("Users", {}, {});
  }
}

// Eksport klasy seeder
export default DemoDataSeeder;
