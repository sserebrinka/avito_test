import { expect } from '@playwright/test';
import { test } from '../fixtures/index'


test('go to boards', async ({ boardsPage }) => {
    await boardsPage.open();
    
    await boardsPage.checkBoardsConsistency();
});