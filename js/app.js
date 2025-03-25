// @ts-nocheck
// 应用主逻辑
document.addEventListener("DOMContentLoaded", () => {
  // 状态变量
  let tasks = []
  let categories = []
  let activeCategory = null
  let activePriority = null
  let darkMode = false

  // 存储模块 (假设 storage 模块已定义)
  const storage = {
    loadTasks: async () => {
      try {
        const tasks = localStorage.getItem("tasks")
        return tasks ? JSON.parse(tasks) : []
      } catch (error) {
        console.error("Failed to load tasks:", error)
        return []
      }
    },
    saveTasks: async (tasks) => {
      try {
        localStorage.setItem("tasks", JSON.stringify(tasks))
      } catch (error) {
        console.error("Failed to save tasks:", error)
      }
    },
    loadCategories: async () => {
      try {
        const categories = localStorage.getItem("categories")
        return categories ? JSON.parse(categories) : []
      } catch (error) {
        console.error("Failed to load categories:", error)
        return []
      }
    },
    saveCategories: async (categories) => {
      try {
        localStorage.setItem("categories", JSON.stringify(categories))
      } catch (error) {
        console.error("Failed to save categories:", error)
      }
    },
    loadTheme: async () => {
      try {
        return localStorage.getItem("theme") || "light"
      } catch (error) {
        console.error("Failed to load theme:", error)
        return "light"
      }
    },
    saveTheme: async (theme) => {
      try {
        localStorage.setItem("theme", theme)
      } catch (error) {
        console.error("Failed to save theme:", error)
      }
    },
    loadFilters: async () => {
      try {
        const filters = localStorage.getItem("filters")
        return filters ? JSON.parse(filters) : { category: null, priority: null }
      } catch (error) {
        console.error("Failed to load filters:", error)
        return { category: null, priority: null }
      }
    },
    saveFilters: async (filters) => {
      try {
        localStorage.setItem("filters", JSON.stringify(filters))
      } catch (error) {
        console.error("Failed to save filters:", error)
      }
    },
  }

  // DOM 元素
  const filterButton = document.getElementById("filter-button")
  const filtersContainer = document.getElementById("filters")
  const themeToggle = document.getElementById("theme-toggle")
  const moonIcon = document.getElementById("moon-icon")
  const sunIcon = document.getElementById("sun-icon")
  const categoryFilters = document.getElementById("category-filters")
  const priorityFilters = document.getElementById("priority-filters")
  const addCategoryButton = document.getElementById("add-category-button")
  const showTaskFormButton = document.getElementById("show-task-form-button")
  const taskForm = document.getElementById("task-form")
  const cancelTaskButton = document.getElementById("cancel-task-button")
  const taskList = document.getElementById("task-list")
  const addCategoryDialog = document.getElementById("add-category-dialog")
  const newCategoryName = document.getElementById("new-category-name")
  const cancelCategoryButton = document.getElementById("cancel-category-button")
  const confirmCategoryButton = document.getElementById("confirm-category-button")
  const editTaskDialog = document.getElementById("edit-task-dialog")
  const editTaskForm = document.getElementById("edit-task-form")
  const cancelEditButton = document.getElementById("cancel-edit-button")
  const overlay = document.getElementById("overlay")
  const taskCategory = document.getElementById("task-category")
  const editTaskCategory = document.getElementById("edit-task-category")

  // 初始化应用
  async function initApp() {
    // 加载数据
    tasks = await storage.loadTasks()
    categories = await storage.loadCategories()
    const savedTheme = await storage.loadTheme()
    const savedFilters = await storage.loadFilters()

    // 设置主题
    darkMode = savedTheme === "dark"
    updateTheme()

    // 设置筛选器
    activeCategory = savedFilters.category
    activePriority = savedFilters.priority

    // 如果没有分类，添加默认分类
    if (categories.length === 0) {
      categories = [
        { id: "1", name: "工作" },
        { id: "2", name: "个人" },
      ]
      await storage.saveCategories(categories)
    }

    // 更新 UI
    updateCategoryFilters()
    updatePriorityFilters()
    updateCategoryDropdowns()
    renderTasks()

    // 设置事件监听器
    setupEventListeners()
  }

  // 设置事件监听器
  function setupEventListeners() {
    // 筛选按钮
    filterButton.addEventListener("click", toggleFilters)

    // 主题切换
    themeToggle.addEventListener("click", toggleTheme)

    // 添加分类按钮
    addCategoryButton.addEventListener("click", showAddCategoryDialog)

    // 显示任务表单按钮
    showTaskFormButton.addEventListener("click", showTaskForm)

    // 取消任务按钮
    cancelTaskButton.addEventListener("click", hideTaskForm)

    // 任务表单提交
    taskForm.addEventListener("submit", handleTaskSubmit)

    // 分类对话框按钮
    cancelCategoryButton.addEventListener("click", hideAddCategoryDialog)
    confirmCategoryButton.addEventListener("click", handleAddCategory)

    // 编辑任务表单提交
    editTaskForm.addEventListener("submit", handleEditTaskSubmit)

    // 取消编辑按钮
    cancelEditButton.addEventListener("click", hideEditTaskDialog)

    // 点击遮罩层关闭对话框
    overlay.addEventListener("click", () => {
      hideAddCategoryDialog()
      hideEditTaskDialog()
    })

    // 分类筛选器点击事件委托
    categoryFilters.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-button") && !e.target.id) {
        const categoryId = e.target.dataset.category
        setActiveCategory(categoryId || null)
      } else if (e.target.classList.contains("delete-button")) {
        const categoryId = e.target.dataset.id
        deleteCategory(categoryId)
      }
    })

    // 优先级筛选器点击事件委托
    priorityFilters.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-button")) {
        const priority = e.target.dataset.priority
        setActivePriority(priority || null)
      }
    })

    // 任务列表点击事件委托
    taskList.addEventListener("click", (e) => {
      const taskItem = e.target.closest(".task-item")
      if (!taskItem) return

      const taskId = taskItem.dataset.id

      // 复选框点击
      if (e.target.closest(".task-checkbox")) {
        toggleTaskCompletion(taskId)
      }

      // 置顶按钮点击
      if (e.target.closest(".pin-button")) {
        togglePinTask(taskId)
      }

      // 编辑按钮点击
      if (e.target.closest(".edit-button")) {
        showEditTaskDialog(taskId)
      }

      // 删除按钮点击
      if (e.target.closest(".delete-button")) {
        deleteTask(taskId)
      }
    })
  }

  // 切换筛选器显示
  function toggleFilters() {
    filtersContainer.classList.toggle("hidden")
  }

  // 切换主题
  function toggleTheme() {
    darkMode = !darkMode
    updateTheme()
    storage.saveTheme(darkMode ? "dark" : "light")
  }

  // 更新主题
  function updateTheme() {
    if (darkMode) {
      document.body.classList.add("dark")
      moonIcon.classList.add("hidden")
      sunIcon.classList.remove("hidden")
    } else {
      document.body.classList.remove("dark")
      moonIcon.classList.remove("hidden")
      sunIcon.classList.add("hidden")
    }
  }

  // 显示添加分类对话框
  function showAddCategoryDialog() {
    addCategoryDialog.classList.remove("hidden")
    overlay.classList.remove("hidden")
    newCategoryName.focus()
  }

  // 隐藏添加分类对话框
  function hideAddCategoryDialog() {
    addCategoryDialog.classList.add("hidden")
    overlay.classList.add("hidden")
    newCategoryName.value = ""
  }

  // 处理添加分类
  function handleAddCategory() {
    const name = newCategoryName.value.trim()
    if (name) {
      addCategory(name)
      hideAddCategoryDialog()
    }
  }

  // 添加分类
  async function addCategory(name) {
    const newCategory = {
      id: Date.now().toString(),
      name,
    }
    categories.push(newCategory)
    await storage.saveCategories(categories)
    updateCategoryFilters()
    updateCategoryDropdowns()
  }

  // 删除分类
  async function deleteCategory(id) {
    categories = categories.filter((category) => category.id !== id)

    // 更新使用此分类的任务
    tasks = tasks.map((task) => (task.categoryId === id ? { ...task, categoryId: null } : task))

    await storage.saveCategories(categories)
    await storage.saveTasks(tasks)

    // 如果当前筛选的是被删除的分类，重置筛选
    if (activeCategory === id) {
      setActiveCategory(null)
    } else {
      updateCategoryFilters()
      updateCategoryDropdowns()
      renderTasks()
    }
  }

  // 更新分类筛选器
  function updateCategoryFilters() {
    // 清除现有的分类按钮（除了"全部"和"添加分类"按钮）
    const buttons = categoryFilters.querySelectorAll(".category-item")
    buttons.forEach((button) => button.remove())

    // 添加分类按钮
    categories.forEach((category) => {
      const categoryItem = document.createElement("div")
      categoryItem.className = "category-item"

      const button = document.createElement("button")
      button.className = `filter-button ${activeCategory === category.id ? "active" : ""}`
      button.dataset.category = category.id
      button.textContent = category.name

      const deleteBtn = document.createElement("button")
      deleteBtn.className = "delete-button"
      deleteBtn.dataset.id = category.id
      deleteBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'

      categoryItem.appendChild(button)
      categoryItem.appendChild(deleteBtn)

      // 插入到"添加分类"按钮之前
      categoryFilters.insertBefore(categoryItem, addCategoryButton)
    })
  }

  // 更新优先级筛选器
  function updatePriorityFilters() {
    const buttons = priorityFilters.querySelectorAll(".filter-button")
    buttons.forEach((button) => {
      const priority = button.dataset.priority
      if ((priority && priority === activePriority) || (!priority && !activePriority)) {
        button.classList.add("active")
      } else {
        button.classList.remove("active")
      }
    })
  }

  // 更新分类下拉菜单
  function updateCategoryDropdowns() {
    // 清除现有的选项（除了"无分类"选项）
    while (taskCategory.options.length > 1) {
      taskCategory.remove(1)
    }

    while (editTaskCategory.options.length > 1) {
      editTaskCategory.remove(1)
    }

    // 添加分类选项
    categories.forEach((category) => {
      const option1 = document.createElement("option")
      option1.value = category.id
      option1.textContent = category.name

      const option2 = option1.cloneNode(true)

      taskCategory.appendChild(option1)
      editTaskCategory.appendChild(option2)
    })
  }

  // 设置活动分类
  async function setActiveCategory(categoryId) {
    activeCategory = categoryId
    updateCategoryFilters()
    renderTasks()
    await storage.saveFilters({ category: activeCategory, priority: activePriority })
  }

  // 设置活动优先级
  async function setActivePriority(priority) {
    activePriority = priority
    updatePriorityFilters()
    renderTasks()
    await storage.saveFilters({ category: activeCategory, priority: activePriority })
  }

  // 显示任务表单
  function showTaskForm() {
    showTaskFormButton.classList.add("hidden")
    taskForm.classList.remove("hidden")
    document.getElementById("task-title").focus()
  }

  // 隐藏任务表单
  function hideTaskForm() {
    taskForm.classList.add("hidden")
    showTaskFormButton.classList.remove("hidden")
    taskForm.reset()
  }

  // 处理任务提交
  async function handleTaskSubmit(e) {
    e.preventDefault()

    const title = document.getElementById("task-title").value.trim()
    if (!title) return

    const description = document.getElementById("task-description").value.trim()
    const dueDate = document.getElementById("task-due-date").value
    const priority = document.getElementById("task-priority").value
    const categoryId = document.getElementById("task-category").value || null

    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || null,
      completed: false,
      dueDate: dueDate || null,
      priority: priority || null,
      categoryId,
      pinned: false,
      createdAt: new Date().toISOString(),
    }

    tasks.push(newTask)
    await storage.saveTasks(tasks)
    renderTasks()
    hideTaskForm()
  }

  // 显示编辑任务对话框
  function showEditTaskDialog(taskId) {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    document.getElementById("edit-task-id").value = task.id
    document.getElementById("edit-task-title").value = task.title
    document.getElementById("edit-task-description").value = task.description || ""
    document.getElementById("edit-task-due-date").value = task.dueDate || ""
    document.getElementById("edit-task-priority").value = task.priority || ""
    document.getElementById("edit-task-category").value = task.categoryId || ""

    editTaskDialog.classList.remove("hidden")
    overlay.classList.remove("hidden")
    document.getElementById("edit-task-title").focus()
  }

  // 隐藏编辑任务对话框
  function hideEditTaskDialog() {
    editTaskDialog.classList.add("hidden")
    overlay.classList.add("hidden")
    editTaskForm.reset()
  }

  // 处理编辑任务提交
  async function handleEditTaskSubmit(e) {
    e.preventDefault()

    const id = document.getElementById("edit-task-id").value
    const title = document.getElementById("edit-task-title").value.trim()
    if (!title) return

    const description = document.getElementById("edit-task-description").value.trim()
    const dueDate = document.getElementById("edit-task-due-date").value
    const priority = document.getElementById("edit-task-priority").value
    const categoryId = document.getElementById("edit-task-category").value || null

    tasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          title,
          description: description || null,
          dueDate: dueDate || null,
          priority: priority || null,
          categoryId,
        }
      }
      return task
    })

    await storage.saveTasks(tasks)
    renderTasks()
    hideEditTaskDialog()
  }

  // 切换任务完成状态
  async function toggleTaskCompletion(taskId) {
    tasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed }
      }
      return task
    })

    await storage.saveTasks(tasks)
    renderTasks()
  }

  // 切换任务置顶状态
  async function togglePinTask(taskId) {
    tasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, pinned: !task.pinned }
      }
      return task
    })

    await storage.saveTasks(tasks)
    renderTasks()
  }

  // 删除任务
  async function deleteTask(taskId) {
    if (confirm("确定要删除这个任务吗？")) {
      tasks = tasks.filter((task) => task.id !== taskId)
      await storage.saveTasks(tasks)
      renderTasks()
    }
  }

  // 渲染任务列表
  function renderTasks() {
    // 筛选任务
    const filteredTasks = tasks.filter((task) => {
      const categoryMatch = !activeCategory || task.categoryId === activeCategory
      const priorityMatch = !activePriority || task.priority === activePriority
      return categoryMatch && priorityMatch
    })

    // 排序任务：置顶优先，然后按截止日期
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      // 置顶任务优先
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      // 然后按截止日期（如果有）
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (a.dueDate && !b.dueDate) return -1
      if (!a.dueDate && b.dueDate) return 1

      // 最后按创建日期
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    // 清空任务列表
    taskList.innerHTML = ""

    // 如果没有任务，显示空状态
    if (sortedTasks.length === 0) {
      const emptyState = document.createElement("div")
      emptyState.className = "empty-state"
      emptyState.textContent = "暂无任务"
      taskList.appendChild(emptyState)
      return
    }

    // 渲染任务
    sortedTasks.forEach((task) => {
      const taskItem = document.createElement("div")
      taskItem.className = `task-item ${task.completed ? "completed" : ""} ${task.pinned ? "pinned" : ""}`
      taskItem.dataset.id = task.id

      // 复选框
      const checkbox = document.createElement("div")
      checkbox.className = "task-checkbox"
      checkbox.innerHTML = task.completed
        ? '<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        : '<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>'

      // 任务内容
      const content = document.createElement("div")
      content.className = "task-content"

      // 标题行
      const titleRow = document.createElement("div")
      titleRow.className = "task-title-row"

      const title = document.createElement("h3")
      title.className = "task-title"
      title.textContent = task.title

      const actions = document.createElement("div")
      actions.className = "task-actions"

      // 置顶按钮
      const pinButton = document.createElement("button")
      pinButton.className = "task-action-button pin-button"
      pinButton.title = task.pinned ? "取消置顶" : "置顶任务"
      pinButton.innerHTML = task.pinned
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v1h6V5a3 3 0 0 0-3-3Z"/><path d="M19 5H5"/><path d="M12 12V5"/><path d="m12 12 4 8"/><path d="M12 12 8 20"/></svg>'

      // 编辑按钮
      const editButton = document.createElement("button")
      editButton.className = "task-action-button edit-button"
      editButton.title = "编辑任务"
      editButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'

      // 删除按钮
      const deleteButton = document.createElement("button")
      deleteButton.className = "task-action-button delete-button"
      deleteButton.title = "删除任务"
      deleteButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'

      actions.appendChild(pinButton)
      actions.appendChild(editButton)
      actions.appendChild(deleteButton)

      titleRow.appendChild(title)
      titleRow.appendChild(actions)

      content.appendChild(titleRow)

      // 描述
      if (task.description) {
        const description = document.createElement("p")
        description.className = "task-description"
        description.textContent = task.description
        content.appendChild(description)
      }

      // 元数据
      const meta = document.createElement("div")
      meta.className = "task-meta"

      // 截止日期
      if (task.dueDate) {
        const isOverdue = new Date(task.dueDate) < new Date() && !task.completed

        const dueDate = document.createElement("div")
        dueDate.className = `task-due-date ${isOverdue ? "overdue" : ""}`

        dueDate.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>${formatDate(task.dueDate)}</span>
        `

        meta.appendChild(dueDate)
      }

      // 优先级
      if (task.priority) {
        const priority = document.createElement("div")
        priority.className = `task-priority ${task.priority}`
        priority.textContent = task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"
        meta.appendChild(priority)
      }

      // 分类
      if (task.categoryId) {
        const category = categories.find((c) => c.id === task.categoryId)
        if (category) {
          const categoryElement = document.createElement("div")
          categoryElement.className = "task-category"
          categoryElement.textContent = category.name
          meta.appendChild(categoryElement)
        }
      }

      content.appendChild(meta)

      taskItem.appendChild(checkbox)
      taskItem.appendChild(content)

      taskList.appendChild(taskItem)
    })
  }

  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // 初始化应用
  initApp()
})

