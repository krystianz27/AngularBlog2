"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoDataSeeder = void 0;
const auth_util_1 = require("../../shared/auth.util");
class DemoDataSeeder {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.bulkDelete("Users", {}, {});
            yield queryInterface.bulkDelete("Categories", {}, {});
            yield queryInterface.bulkDelete("Tags", {}, {});
            yield queryInterface.bulkDelete("Posts", {}, {});
            yield queryInterface.bulkDelete("Comments", {}, {});
            yield queryInterface.bulkDelete("PostTags", {}, {});
            const usersData = [
                {
                    name: "Jan Kowalski",
                    email: "jan.kowalski@example.com",
                    password: (0, auth_util_1.encryptPassword)("hashed_password!@#HASH"),
                    status: "active",
                },
                {
                    name: "Anna Nowak",
                    email: "anna.nowak@example.com",
                    password: (0, auth_util_1.encryptPassword)("hashed_password!@#HASH"),
                    status: "active",
                },
                {
                    name: "Piotr Wiśniewski",
                    email: "piotr.wisniewski@example.com",
                    password: (0, auth_util_1.encryptPassword)("hashed_password!@#HASH"),
                    status: "active",
                },
                {
                    name: "Maria Kaczmarek",
                    email: "maria.kaczmarek@example.com",
                    password: (0, auth_util_1.encryptPassword)("hashed_password!@#HASH"),
                    status: "active",
                },
                {
                    name: "Tomasz Lewandowski",
                    email: "tomasz.lewandowski@example.com",
                    password: (0, auth_util_1.encryptPassword)("hashed_password!@#HASH"),
                    status: "active",
                },
                {
                    name: "Katarzyna Zielińska",
                    email: "katarzyna.zielinska@example.com",
                    password: (0, auth_util_1.encryptPassword)("hashed_password!@#HASH"),
                    status: "active",
                },
                {
                    name: "Jakub Wróbel",
                    email: "jakub.wrobel@example.com",
                    password: (0, auth_util_1.encryptPassword)("hashed_password!@#HASH"),
                    status: "active",
                },
                {
                    name: "Ola Jankowska",
                    email: "ola.jankowska@example.com",
                    password: (0, auth_util_1.encryptPassword)("hashed_password!@#HASH"),
                    status: "active",
                },
                {
                    name: "user1",
                    email: "user1@mail.com",
                    password: (0, auth_util_1.encryptPassword)("User123"),
                    status: "active",
                },
            ];
            yield queryInterface.bulkInsert("Users", usersData.map((user) => (Object.assign(Object.assign({}, user), { createdAt: new Date(), updatedAt: new Date() }))));
            const [users] = (yield queryInterface.sequelize.query(`SELECT * FROM Users WHERE email IN (${usersData
                .map((user) => `'${user.email}'`)
                .join(", ")})`));
            const categoriesData = [
                { name: "Podróże", slug: "podroze" },
                { name: "Kultura", slug: "kultura" },
                { name: "Sport", slug: "sport" },
                { name: "Muzyka", slug: "muzyka" },
                { name: "Gastronomia", slug: "gastronomia" },
                { name: "Zdrowie", slug: "zdrowie" },
            ];
            yield queryInterface.bulkInsert("Categories", categoriesData.map((category, index) => (Object.assign(Object.assign({}, category), { userId: users[index % users.length].id, createdAt: new Date(), updatedAt: new Date() }))));
            const [categories] = (yield queryInterface.sequelize.query(`SELECT * FROM Categories WHERE slug IN (${categoriesData
                .map((cat) => `'${cat.slug}'`)
                .join(", ")})`));
            const postsData = [
                {
                    title: "Moje podróże po Azji",
                    content: "Azja, kontynent pełen kontrastów, oferuje niezliczone piękne miejsca do odkrycia. Moje podróże prowadziły mnie przez malownicze góry Himalajów, tętniące życiem miasta Tokio oraz spokojne plaże Bali. Każde z tych miejsc zostawiło we mnie niezatarte wspomnienia. W tym poście dzielę się moimi ulubionymi destynacjami, lokalnymi przysmakami oraz wskazówkami dla tych, którzy planują odwiedzić te niesamowite miejsca.",
                    slug: "moje-podroze-po-azji",
                },
                {
                    title: "Kultura w Europie",
                    content: "Europa to skarbnica kultury, historii i sztuki. Od majestatycznych katedr po nowoczesne muzea, każdy kraj oferuje coś unikalnego. W tym poście zabiorę Was w podróż po najważniejszych kulturalnych punktach Europy, w tym do Paryża, Rzymu i Barcelony. Przygotujcie się na odkrycie tajemnic, które skrywa każdy zakątek tych fascynujących miejsc.",
                    slug: "kultura-w-europie",
                },
                {
                    title: "Mistrzostwa w piłce nożnej",
                    content: "Mistrzostwa świata w piłce nożnej to nie tylko wydarzenie sportowe, ale prawdziwe święto dla fanów z całego świata. W tym artykule przybliżam historię mistrzostw, niezapomniane mecze oraz niezwykłe historie piłkarzy, którzy zapisali się w annałach futbolu. Przygotujcie się na emocjonującą podróż przez świat futbolu!",
                    slug: "mistrzostwa-w-pilce",
                },
                {
                    title: "Muzyka i emocje",
                    content: "Muzyka to język uniwersalny, który potrafi wyrazić to, co często pozostaje niewypowiedziane. W tym poście omawiam, jak różne gatunki muzyczne wpływają na nasze emocje oraz jakie utwory są moimi osobistymi ulubieńcami. Przeżyjmy razem podróż przez dźwięki, które kształtują nasze życie i wspomnienia.",
                    slug: "muzyka-i-emocje",
                },
                {
                    title: "Najlepsze restauracje w mieście",
                    content: "Jedzenie to nie tylko sposób na zaspokojenie głodu, ale także wyjątkowe doświadczenie kulturowe. W tym artykule przedstawiam moje ulubione restauracje w mieście, które serwują nie tylko pyszne potrawy, ale także tworzą niepowtarzalną atmosferę. Od eleganckich restauracji po urokliwe bistro - każdy znajdzie coś dla siebie!",
                    slug: "najlepsze-restauracje",
                },
                {
                    title: "Zdrowy styl życia",
                    content: "Zdrowy styl życia to nie tylko moda, ale klucz do długowieczności i dobrego samopoczucia. W tym poście dzielę się moimi sprawdzonymi sposobami na utrzymanie zdrowej diety, regularnej aktywności fizycznej i dbania o zdrowie psychiczne. Odkryjmy razem, jak małe zmiany mogą prowadzić do wielkich rezultatów.",
                    slug: "zdrowy-styl-zycia",
                },
                {
                    title: "Książki, które musisz przeczytać",
                    content: "Literatura to okno na świat i narzędzie do odkrywania nowych perspektyw. W tym artykule przedstawiam moje ulubione książki, które zainspirowały mnie do działania oraz pozwoliły zrozumieć różnorodność ludzkiego doświadczenia. Niezależnie od gatunku, każda z tych książek ma w sobie coś, co warto poznać.",
                    slug: "ksiazki-ktore-musisz-przeczytac",
                },
                {
                    title: "Wakacje w górach",
                    content: "Góry to miejsce, gdzie natura odsłania swoje najpiękniejsze oblicze. W tym poście dzielę się swoimi doświadczeniami z wakacji w górach, od pieszych wędrówek po relaks w schroniskach. Odkryjmy razem, jak górskie przygody mogą nas wzbogacić i dać nowe siły do działania.",
                    slug: "wakacje-w-gorach",
                },
                {
                    title: "Sztuka nowoczesna",
                    content: "Sztuka nowoczesna to wyraz złożonych idei i emocji, które często mogą być trudne do zrozumienia. W tym artykule przybliżam różne nurty sztuki nowoczesnej oraz ich wpływ na współczesne społeczeństwo. Zachęcam do odkrywania sztuki, która wyraża naszą rzeczywistość w sposób unikalny i inspirujący.",
                    slug: "sztuka-nowoczesna",
                },
                {
                    title: "Podróże na nartach",
                    content: "Zima to czas, kiedy wiele osób wyrusza na stoki narciarskie, aby poczuć adrenalinę i cieszyć się pięknem górskich krajobrazów. W tym poście omawiam najlepsze miejsca do jazdy na nartach, sprzęt, który warto zabrać ze sobą oraz porady dla początkujących narciarzy. Przekonaj się, jak wspaniałe mogą być zimowe przygody!",
                    slug: "podroze-na-nartach",
                },
            ];
            yield queryInterface.bulkInsert("Posts", postsData.map((post, index) => (Object.assign(Object.assign({}, post), { userId: users[index % users.length].id, categoryId: categories[index % categories.length].id, createdAt: new Date(), updatedAt: new Date() }))));
            const [posts] = (yield queryInterface.sequelize.query(`SELECT * FROM Posts WHERE slug IN (${postsData
                .map((post) => `'${post.slug}'`)
                .join(", ")})`));
            const commentsData = [
                {
                    content: "Ciekawe, gdzie jeszcze można pojechać w Azji.",
                    postId: posts[0].id,
                    userId: users[1].id,
                },
                {
                    content: "Czy planujesz dodać więcej o kulturze europejskiej?",
                    postId: posts[1].id,
                    userId: users[2].id,
                },
                {
                    content: "Futbol to niesamowita gra, nie mogę się doczekać mistrzostw!",
                    postId: posts[2].id,
                    userId: users[3].id,
                },
                {
                    content: "Uwielbiam muzykę! Jakie utwory polecasz?",
                    postId: posts[3].id,
                    userId: users[4].id,
                },
                {
                    content: "Czy masz jakieś ulubione dania z tych restauracji?",
                    postId: posts[4].id,
                    userId: users[5].id,
                },
                {
                    content: "Dzięki za porady dotyczące zdrowego stylu życia!",
                    postId: posts[5].id,
                    userId: users[6].id,
                },
                {
                    content: "Jakie książki mogę przeczytać w tym miesiącu?",
                    postId: posts[6].id,
                    userId: users[7].id,
                },
                {
                    content: "Jakie są Twoje ulubione trasy górskie?",
                    postId: posts[7].id,
                    userId: users[0].id,
                },
                {
                    content: "Sztuka nowoczesna zawsze mnie fascynowała.",
                    postId: posts[8].id,
                    userId: users[1].id,
                },
                {
                    content: "Jakie miejsca polecasz na zimowy wypoczynek?",
                    postId: posts[9].id,
                    userId: users[2].id,
                },
            ];
            yield queryInterface.bulkInsert("Comments", commentsData.map((comment) => (Object.assign(Object.assign({}, comment), { createdAt: new Date(), updatedAt: new Date() }))));
            const tagsData = [
                { name: "Podróże", slug: "podroze", userId: users[0].id },
                { name: "Kultura", slug: "kultura", userId: users[1].id },
                { name: "Sport", slug: "sport", userId: users[2].id },
                { name: "Muzyka", slug: "muzyka", userId: users[3].id },
                { name: "Gastronomia", slug: "gastronomia", userId: users[4].id },
                { name: "Zdrowie", slug: "zdrowie", userId: users[5].id },
            ];
            yield queryInterface.bulkInsert("Tags", tagsData.map((tag) => (Object.assign(Object.assign({}, tag), { createdAt: new Date(), updatedAt: new Date() }))));
            const [tags] = (yield queryInterface.sequelize.query(`SELECT * FROM Tags WHERE slug IN (${tagsData
                .map((tag) => `'${tag.slug}'`)
                .join(", ")})`));
            const postTagsData = tags.map((tag, index) => ({
                postId: posts[index % posts.length].id,
                tagId: tag.id,
            }));
            yield queryInterface.bulkInsert("PostTags", postTagsData.map((postTag) => (Object.assign(Object.assign({}, postTag), { createdAt: new Date(), updatedAt: new Date() }))));
        });
    }
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.bulkDelete("PostTags", {}, {});
            yield queryInterface.bulkDelete("Tags", {}, {});
            yield queryInterface.bulkDelete("Comments", {}, {});
            yield queryInterface.bulkDelete("Posts", {}, {});
            yield queryInterface.bulkDelete("Categories", {}, {});
            yield queryInterface.bulkDelete("Users", {}, {});
        });
    }
}
exports.DemoDataSeeder = DemoDataSeeder;
exports.default = DemoDataSeeder;