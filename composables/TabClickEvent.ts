export const calibrationNextTabNavigate = ( currentTabIndex: number ) => {
   const targetTab: HTMLElement = document.querySelector( `[data-menu-tab="1${ currentTabIndex + 1 }"]` ) as HTMLElement
   targetTab.click()
}

export const calibrationPrevTabNavigate = ( currentTabIndex: number ) => {
   const targetTab: HTMLElement = document.querySelector( `[data-menu-tab="1${ currentTabIndex - 1 }"]` ) as HTMLElement
   targetTab.click()
}

export const evaluationNextTabNavigate = ( currentTabIndex: number ) => {
   const targetTab: HTMLElement = document.querySelector( `[data-menu-tab="2${ currentTabIndex + 1 }"]` ) as HTMLElement
   targetTab.click()
}

export const evaluationPrevTabNavigate = ( currentTabIndex: number ) => {
   const targetTab: HTMLElement = document.querySelector( `[data-menu-tab="2${ currentTabIndex - 1 }"]` ) as HTMLElement
   targetTab.click()
}

export const forecastNextTabNavigate = ( currentTabIndex: number ) => {
   const targetTab: HTMLElement = document.querySelector( `[data-menu-tab="3${ currentTabIndex + 1 }"]` ) as HTMLElement
   targetTab.click()
}

export const forecastPrevTabNavigate = ( currentTabIndex: number ) => {
   const targetTab: HTMLElement = document.querySelector( `[data-menu-tab="3${ currentTabIndex - 1 }"]` ) as HTMLElement
   targetTab.click()
}