import { Page, Locator, expect } from '@playwright/test';

export class IssuesPage {
    public buttonCreateIssue: Locator;
    public summaryInput: Locator;
    public descriptionInput: Locator;
    public listUl: Locator;
    public projectList: Locator;
    public priorityList: Locator;
    public statusList: Locator;
    public executorList: Locator;
    public buttonCreate: Locator;
    public projectAndExecutorText: Locator;
    public firstCardIssues: Locator;
    public searchInput: Locator;
    public statusFilter: Locator;
    public boardFilter: Locator;
    public statusesIssues: Locator;


    constructor(public readonly page: Page) {
        this.buttonCreateIssue = this.page.locator('button.css-iafu2n');
        this.summaryInput = this.page.locator('input.css-1pk1fka');
        this.descriptionInput = this.page.locator('textarea[id=":r8:"]');
        this.listUl = this.page.locator('ul[aria-labelledby="select-label"]');
        this.projectList = this.page.getByRole('combobox', { name: 'Проект' }).nth(0);
        this.priorityList = this.page.getByRole('combobox', { name: 'Проект' }).nth(1);
        this.statusList = this.page.getByRole('combobox', { name: 'Проект' }).nth(2)
        this.executorList = this.page.getByRole('combobox', { name: 'Проект' }).nth(3);
        this.buttonCreate = this.page.getByRole('button', { name: 'Создать' });
        this.projectAndExecutorText = this.page.locator('.MuiStack-root p').first();
        this.firstCardIssues = this.page.locator('.MuiStack-root div').first();
        this.searchInput = this.page.locator('input[placeholder="Поиск"]');
        this.statusFilter = this.page.getByRole('combobox').nth(0);
        this.boardFilter = this.page.getByRole('combobox').nth(1);
        this.statusesIssues = this.page.locator('div.MuiStack-root span');
    }

    public async open(url: string = '/') {
        await this.page.goto(url);
        await expect(this.page).toHaveURL('/issues');
    }

    public async fillIssues(summary: string, description: string,
            projectValue: string = "1", priorityValue: string = "Low", executorValue: string = "1") {
        const projectName = this.page.locator(`li[data-value="${projectValue}"]`);
        const priority = this.page.locator(`li[data-value="${priorityValue}"]`);
        const executor = this.page.locator(`li[data-value="${executorValue}"]`);

        await this.summaryInput.fill(summary);
        await this.descriptionInput.fill(description);

        await this.projectList.click();
        await expect(projectName).toBeVisible();
        await projectName.click();

        await expect(projectName).not.toBeVisible();

        await this.priorityList.click();
        await expect(priority).toBeVisible();
        await priority.click();

        await expect(this.listUl).not.toBeVisible();

        await this.executorList.click();
        await expect(executor).toBeVisible();
        await executor.click();

        await expect(this.listUl).not.toBeVisible();

        await this.buttonCreate.click();
    }

    public async verifyAllFieldsAreVisible() {
        await expect(this.descriptionInput).toBeVisible();
        await expect(this.projectList).toBeVisible();
        await expect(this.priorityList).toBeVisible();
        await expect(this.statusList).toBeVisible();
        await expect(this.executorList).toBeVisible();
    }

    public async getFullProjectExecutorText() {
        await expect(this.projectAndExecutorText).toBeVisible();
        const text = await this.projectAndExecutorText.innerText();
        return text?.trim() || '';
    }

    private async parseProjectExecutorText() {
        const fullText = await this.getFullProjectExecutorText();
        
        const parts = fullText.split(' | ');
        
        const projectPart = parts[0].trim();
        const executorPart = parts[1].trim();
        
        const project = projectPart.replace('Доска:', '').trim();
        const executor = executorPart.replace('Исполнитель:', '').trim();
        
        return { project, executor };
    }

    public async getProjectName() {
        const { project } = await this.parseProjectExecutorText();
        return project;
    }

    public async getExecutorName() {
        const { executor } = await this.parseProjectExecutorText();
        return executor;
    }

    public async searchAndCheck(word: string) {
        const issueTitles = this.page.locator('.MuiBox-root h6');

        await this.searchInput.fill(word);
        await expect(this.searchInput).toHaveValue(word);

        await issueTitles.first().waitFor({ state: 'visible' });

        const count = await issueTitles.count();

        if (count === 0) {
            return;
        }

        for (let i = 0; i < count; i++) {
            const text = (await issueTitles.nth(i).innerText()).toLowerCase();
            const target = word.toLowerCase();
            await expect(text).toContain(target);
        }
    }

    public async searchAndCheckByFilterStatus(status: string) {
        await this.statusFilter.click();
        const statusChoice = this.page.locator(`li[data-value="${status}"]`);

        await statusChoice.click();
        await this.statusesIssues.first().waitFor({ state: 'visible' });
        
        const count = await this.statusesIssues.count();

        if (count === 0) {
            return;
        }

        const statusesList: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = (await this.statusesIssues.nth(i).innerText()).trim();
            statusesList.push(text);
        }

        statusesList.forEach(s => {
            expect(s).toBe(status);
        })
    }

    public async searchAndCheckByFilterBoard(board: string) {
        await this.boardFilter.click();
        const boardChoice = this.page.locator(`li[data-value="${board}"]`);

        await boardChoice.click();
        await this.projectAndExecutorText.first().waitFor({ state: 'visible' });
        
        const count = await this.projectAndExecutorText.count();

        if (count === 0) {
            return;
        }

        const boardsList: string[] = [];
        for (let i = 0; i < count; i++) {
            const cardText = this.page.locator('.MuiStack-root p').nth(i);
            const text = await cardText.innerText();
            const project = text.split('|')[0].replace('Доска:', '').trim();
            boardsList.push(project);
        }

        boardsList.forEach(s => {
            expect(s).toBe(board);
        })
    }

}