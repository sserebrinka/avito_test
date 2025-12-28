import { IssuesPage } from "./IssuesPage";
import { BoardsPage } from "./BoardsPage";
import { test as base } from "@playwright/test";

type Fixtures = {
    issuesPage: IssuesPage;
    boardsPage: BoardsPage;
}

export const test = base.extend<Fixtures>({
    issuesPage: async ({ page }, use) => {
        const issuesPage = new IssuesPage(page);
        use (issuesPage)
    },
    boardsPage: async ({ page }, use) => {
        const boardsPage = new BoardsPage(page);
        use (boardsPage)
    },
})