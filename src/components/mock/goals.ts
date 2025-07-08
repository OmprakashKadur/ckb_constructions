 export const allGoals =[{
    "id": "goal_001",
    "user_id": "user_123",
    "title": "Learn React Development",
    "sub_goals": [
      {
        "id": "sub_001",
        "main_goal_id": "goal_001",
        "title": "React Basics",
        "sort_order": 1,
        "tasks": [
          {
            "id": "task_001",
            "sub_goal_id": "sub_001",
            "text": "Understand JSX",
            "is_done": false,
            "due_date": null
          },
          {
            "id": "task_002",
            "sub_goal_id": "sub_001",
            "text": "Learn useState and useEffect",
            "is_done": true,
            "due_date": "2025-07-10"
          }
        ]
      },
      {
        "id": "sub_002",
        "main_goal_id": "goal_001",
        "title": "Advanced Concepts",
        "sort_order": 2,
        "tasks": [
          {
            "id": "task_003",
            "sub_goal_id": "sub_002",
            "text": "Understand Context API",
            "is_done": false,
            "due_date": null
          },
          {
            "id": "task_004",
            "sub_goal_id": "sub_002",
            "text": "Use React Router",
            "is_done": false,
            "due_date": null
          }
        ]
      }
    ]
  },
  {
    "id": "goal_002",
    "user_id": "user_123",
    "title": "Learn MySQL ",
    "sub_goals": [
      {
        "id": "sub_001",
        "main_goal_id": "goal_002",
        "title": "MySQL Basics",
        "sort_order": 1,
        "tasks": [
          {
            "id": "task_001",
            "sub_goal_id": "sub_001",
            "text": "Understand Quires",
            "is_done": false,
            "due_date": null
          },
          {
            "id": "task_002",
            "sub_goal_id": "sub_001",
            "text": "Understand Tables",
            "is_done": true,
            "due_date": "2025-07-10"
          }
        ]
      },
      {
        "id": "sub_002",
        "main_goal_id": "goal_002",
        "title": "MySQL Advanced",
        "sort_order": 2,
        "tasks": [
          {
            "id": "task_003",
            "sub_goal_id": "sub_002",
            "text": "Understand Indexes",
            "is_done": false,
            "due_date": null
          },
          {
            "id": "task_004",
            "sub_goal_id": "sub_002",
            "text": "Understand Views",
            "is_done": false,
            "due_date": null
          }
        ]
      }
    ]
  }]