import { expect } from '@playwright/test';
import { test } from '../fixtures/index'


test('create issues', async ({ page, issuesPage }) => {
    await issuesPage.open();

    const firstSubtitle = page.locator('.MuiTypography-subtitle1').first();
    await expect(firstSubtitle).toBeVisible();

    await issuesPage.buttonCreateIssue.click();
    await issuesPage.verifyAllFieldsAreVisible();

    await issuesPage.fillIssues("Abc", "abc");

    const issueTitles = page.locator('h6');
    const newIssue = issueTitles.filter({ hasText: "Abc" });

    await expect(newIssue).toBeVisible({ timeout: 5000 });
    
    const count = await issueTitles.count();
    const titlesList: string[] = [];

    for (let i = 0; i < count; i++) {
        const title = (await issueTitles.nth(i).innerText()).trim();
        titlesList.push(title);
    }

    expect(titlesList).toContain('Abc');
});

test('open task', async ({ page, issuesPage }) => {
    await issuesPage.open();

    const summaryExpected = await page.locator('h6').first().innerText();
    const projectExpected = await issuesPage.getProjectName();
    const statusExpected = await issuesPage.statusesIssues.first().innerText();
    const executorExpected = await issuesPage.getExecutorName();

    await issuesPage.firstCardIssues.click();

    const summaryField = page.locator('input[required][type="text"]');
    await expect(summaryField).toHaveValue(summaryExpected);

    await issuesPage.verifyAllFieldsAreVisible();

    const summaryActual = await page.locator('input[required][type="text"]').inputValue();
    const projectActual = await page.locator('div[aria-disabled="true"]').innerText();

    await issuesPage.statusList.click();
    const statusActual = await page.locator('li[aria-selected="true"]').innerText();

    await page.keyboard.press('Escape');
    await expect(issuesPage.listUl).not.toBeVisible();

    await issuesPage.executorList.click();
    const executorActual = await page.locator('li[aria-selected="true"]').innerText();

    await page.keyboard.press('Escape');
    await expect(issuesPage.listUl).not.toBeVisible();

    console.log(summaryActual, summaryExpected);

    await expect(summaryActual).toBe(summaryExpected);
    await expect(projectActual).toBe(projectExpected);
    await expect(statusActual).toBe(statusExpected);
    await expect(executorActual).toBe(executorExpected);
});

test('search issues', async ({ issuesPage }) => {
    await issuesPage.open();

    const word = 'реали';
    await issuesPage.searchAndCheck(word);
});

test('search issues by status', async ({ issuesPage }) => {
    await issuesPage.open();

    const status = "InProgress"
    await issuesPage.searchAndCheckByFilterStatus(status);
});

test('search issues by board', async ({ issuesPage }) => {
    await issuesPage.open();

    const board = "Редизайн карточки товара"
    await issuesPage.searchAndCheckByFilterBoard(board);
});

