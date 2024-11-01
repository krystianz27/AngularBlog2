import { QueryInterface, Sequelize } from "sequelize";
import { User } from "../User";
import { Category } from "../Category";
import { Post } from "../Post";
import { Comment } from "../Comment";
import { Tag } from "../Tag";
import { PostTag } from "../PostTag";

export class DemoDataSeeder {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    // Resetowanie bazy danych
    await queryInterface.bulkDelete("Users", {}, {});
    await queryInterface.bulkDelete("Categories", {}, {});
    await queryInterface.bulkDelete("Tags", {}, {});
    await queryInterface.bulkDelete("Posts", {}, {});
    await queryInterface.bulkDelete("Comments", {}, {});
    await queryInterface.bulkDelete("PostTags", {}, {});

    // Tworzenie użytkowników
    await queryInterface.bulkInsert("Users", [
      {
        name: "Jan Kowalski",
        email: "jan.kowalski@example.com",
        password: "hashed_password!@#HASH",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Anna Nowak",
        email: "anna.nowak@example.com",
        password: "hashed_password!@#HASH",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Piotr Wiśniewski",
        email: "piotr.wisniewski@example.com",
        password: "hashed_password!@#HASH",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Fetch inserted users
    const users = (
      await queryInterface.sequelize.query(
        `SELECT * FROM Users WHERE email IN ('jan.kowalski@example.com', 'anna.nowak@example.com', 'piotr.wisniewski@example.com')`
      )
    )[0] as User[];

    // Tworzenie kategorii
    await queryInterface.bulkInsert("Categories", [
      {
        name: "Programowanie",
        slug: "programowanie",
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Podróże",
        slug: "podroze",
        userId: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Fetch inserted categories
    const categories = (
      await queryInterface.sequelize.query(
        `SELECT * FROM Categories WHERE slug IN ('programowanie', 'podroze')`
      )
    )[0] as Category[];

    // Tworzenie tagów
    await queryInterface.bulkInsert("Tags", [
      {
        name: "JavaScript",
        slug: "javascript",
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "React",
        slug: "react",
        userId: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Fetch inserted tags
    const tags = (
      await queryInterface.sequelize.query(
        `SELECT * FROM Tags WHERE slug IN ('javascript', 'react')`
      )
    )[0] as Tag[];

    // Tworzenie postów
    await queryInterface.bulkInsert("Posts", [
      {
        title: "Moje pierwsze posty",
        content: "Treść mojego pierwszego posta...",
        slug: "moje-pierwsze-posty",
        userId: users[0].id,
        categoryId: categories[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Podróże po Europie",
        content: "Treść mojego drugiego posta...",
        slug: "podroze-po-europie",
        userId: users[1].id,
        categoryId: categories[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Fetch inserted posts
    const posts = (
      await queryInterface.sequelize.query(
        `SELECT * FROM Posts WHERE slug IN ('moje-pierwsze-posty', 'podroze-po-europie')`
      )
    )[0] as Post[];

    // Tworzenie komentarzy
    await queryInterface.bulkInsert("Comments", [
      {
        content: "Świetny post!",
        userId: users[1].id,
        postId: posts[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Tworzenie powiązań między postami a tagami
    await queryInterface.bulkInsert("PostTags", [
      {
        postId: posts[0].id,
        tagId: tags[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: posts[0].id,
        tagId: tags[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: posts[1].id,
        tagId: tags[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
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

export default DemoDataSeeder;
