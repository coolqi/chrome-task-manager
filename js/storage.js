// 存储工具函数
const storage = {
  // 加载任务
  loadTasks: () =>
    new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get(["tasks"], (result) => {
          resolve(result.tasks || [])
        })
      } else {
        // Handle the case where chrome.storage is not available (e.g., testing environment)
        resolve([])
      }
    }),

  // 保存任务
  saveTasks: (tasks) =>
    new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ tasks }, resolve)
      } else {
        resolve()
      }
    }),

  // 加载分类
  loadCategories: () =>
    new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get(["categories"], (result) => {
          resolve(result.categories || [])
        })
      } else {
        resolve([])
      }
    }),

  // 保存分类
  saveCategories: (categories) =>
    new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ categories }, resolve)
      } else {
        resolve()
      }
    }),

  // 加载主题
  loadTheme: () =>
    new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get(["theme"], (result) => {
          resolve(result.theme || "light")
        })
      } else {
        resolve("light")
      }
    }),

  // 保存主题
  saveTheme: (theme) =>
    new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ theme }, resolve)
      } else {
        resolve()
      }
    }),

  // 加载筛选器状态
  loadFilters: () =>
    new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get(["filters"], (result) => {
          resolve(result.filters || { category: null, priority: null })
        })
      } else {
        resolve({ category: null, priority: null })
      }
    }),

  // 保存筛选器状态
  saveFilters: (filters) =>
    new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ filters }, resolve)
      } else {
        resolve()
      }
    }),
}

