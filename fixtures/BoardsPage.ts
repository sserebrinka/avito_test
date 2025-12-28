import { Page, Locator, expect } from '@playwright/test';

export class BoardsPage {
    public projectsName: Locator;
    public boardLinks: Locator;
    public boardTitle: Locator;

    constructor(public readonly page: Page) {
        this.projectsName = this.page.locator('.MuiBox-root h6');
        this.boardLinks = this.page.locator('a[href^="/board/"]');
        this.boardTitle = this.page.locator('h4');
    }

    public async open(url: string = '/') {
        const linkBoards = this.page.locator('a[href="/boards"]');

        await this.page.goto(url);
        await linkBoards.click();
        await expect(this.page).toHaveURL('/boards');
    }

    public async checkBoardsConsistency() {
        await this.projectsName.first().waitFor({ state: 'visible', timeout: 15000 });
        
        const boardsMain: string[] = [];
        const count = await this.projectsName.count();
        for (let i = 0; i < count; i++) {
            boardsMain.push((await this.projectsName.nth(i).innerText()).trim());
        }

        const linksCount = await this.boardLinks.count();
        const hrefs: string[] = [];
        for (let i = 0; i < linksCount; i++) {
            const href = await this.boardLinks.nth(i).getAttribute('href');
            if (href) {
                hrefs.push(href);
            }
        }

        const boardsOnPage: string[] = [];
        for (const href of hrefs) {
            const link = this.page.locator(`a[href="${href}"]`);
            await link.click();

            await this.boardTitle.first().waitFor({ state: 'visible' });
            const title = (await this.boardTitle.first().innerText()).trim();
            boardsOnPage.push(title);

            await this.page.goBack();
            await this.projectsName.first().waitFor({ state: 'visible' });
        }

        expect(boardsOnPage).toEqual(boardsMain);
    }

}