const { Builder, By, Key, until } = require("selenium-webdriver");
let fs = require('fs');

async function pucminas() {
    let driver = await new Builder().forBrowser('firefox').build();
    await driver.manage().setTimeouts({ implicit: 10000 });

    // Acessa a página Inicial PUC Minas, localiza Serviços e Bibliotecas e faz o clique !
    await driver.get("https://www.pucminas.br/destaques/Paginas/default.aspx")
    await driver.findElement(By.partialLinkText("Serviços")).click();
    await driver.findElement(By.partialLinkText("Biblioteca")).click();

    // Percorre todas as janelas abertas e define a janela padrão como a nova aberta 
    let windows = await driver.getAllWindowHandles();
    windows.forEach(async (handle, index) => {
        if (index == 1) {
            await driver.switchTo().window(handle);
        }
    });

    // Localiza o campo de pesquisa e insere "teste de software" e da "ENTER"
    await driver.findElement(By.name('uquery')).sendKeys("teste de software", Key.RETURN)

    // Percorre novamente todas as janelas abertas e define a janela padrão como a nova aberta 
    windows = await driver.getAllWindowHandles();
    windows.forEach(async (handle, index) => {
        if (index == 2) {
            await driver.switchTo().window(handle);
        }
    });

    // Realiza uma contagem de 5 páginas e faz o next de cada uma, printando a página através da biblioteca FS
    let paginas = 5
    for(let i = 1; i <= paginas; i++)
    {
        let time = await driver.wait(until.elementLocated(By.id('ctl00_ctl00_MainContentArea_MainContentArea_bottomMultiPage_lnkNext', 30000, 'timed out after 30 seconds', 5000)))
        try {
            let base64 = await driver.printPage();
            await fs.writeFileSync(`./pagina-${i}.pdf`, base64, 'base64');
        } catch (e) {
            console.log(e)
        }

        await driver.findElement(By.id("ctl00_ctl00_MainContentArea_MainContentArea_bottomMultiPage_lnkNext")).click();
    }

    // Finaliza o teste e fecha o driver do navegador
    await driver.quit();
}

pucminas();