let data=[];
window._gh_list_menu_register(
  {
    id: "history",
    target: "built_in"
  },
  [
    {
      id: 'custom_advanced_search',
      icon: 'query_stats',
      name: '历史记录',
      query: {
        type: 'advanced_search',
        updateConditions: async (e) => {
          let arr = [
            {
              "id": "search",
              "type": "search"
            },
            {
              "id": "source",
              "name": "数据源",
              "type": "select",
              "options": [
              ]
            },
            {
              "id": "tag",
              "name": "标签",
              "type": "tag_multiple",
              "options": [

              ],
            },
            {
              "id": "update_time",
              "name": "更新时间",
              "type": "time_range"
            },
            {
              "id": "creation_time",
              "name": "创建时间",
              "type": "time_range"
            }
          ]
          let history = await window._gh_web_db.getAll('history')
          const details = await window._gh_web_db.getAll('details')
          history.forEach(x => {
            const obj = details.find(c => c.id == x.id)
            if (obj) {
              x.data = obj.data;
            }
          })
          data = history;
          const names=window._gh_source_get_all_name()
          names.forEach(x => {
            const config= window._gh_source_get_config(x)
            arr[1].options.push({ "label": config.name, "value": config.id })
          })
          let author = []
          let styles = []
          history.forEach(x => {
            if (x.data) {
              if (Array.isArray(x.data?.author)) {
                x.data.author.forEach(x => {
                  author.push(x.name)
                })
              }
              if (Array.isArray(x.data?.styles)) {
                x.data.styles.forEach(x => {
                  styles.push(x.name)
                })
              }

            }

          })
          author = [...new Set(author)]
          styles = [...new Set(styles)]
          arr[2].options.push({
            "id":"tag",
            "title": "标签",
            "tags": styles.map(x => ({ label: x, value: x }))
          })

          arr[2].options.push({
            "id":"author",
            "title": "作者",
            "tags": author.map(x => ({ label: x, value: x }))
          })
          return arr
        },
        conditions: [
          {
            "id": "search",
            "type": "search"
          },
          {
            "id": "source",
            "name": "数据源",
            "type": "select",
            "options": [
            ]
          },
          {
            "id": "tag",
            "name": "标签",
            "type": "tag_multiple",
            "options": [

            ],
          },
          {
            "id": "update_time",
            "name": "更新时间",
            "type": "time_range"
          },
          {
            "id": "creation_time",
            "name": "创建时间",
            "type": "time_range"
          }
        ],
        click: async (e) => {
           window._gh_navigate(['/detail', e.data.source, e.data.id])
          // window._gh_navigate()

        }
      },
      getList: async (obj) => {
        if (data.length == 0) {
          let history = await window._gh_web_db.getAll('history')
          const details = await window._gh_web_db.getAll('details')
          history.forEach(x => {
            const obj = details.find(c => c.id == x.id)
            if (obj) {
              x.data = obj.data;
            }
          })
          data = history;
        }
        let res=data
        if(obj.source) res=res.filter(x=>x.source==obj.source)
        if(obj.tag&&obj.tag.length){
          obj.tag.forEach(e=>{
            if(e.parent_id=="tag"){
              res=res.filter(x=>{
                const bool=x?.data?.styles?.map(c=>c.name).includes(e.value);
                return bool
              })
            }
            if(e.parent_id=="author"){
              res=res.filter(x=>{
                if (Array.isArray(x.data?.author)){
                  const bool=x?.data?.author?.map(c=>c.name)?.includes(e.value);
                  return bool
                }else{
                  return false
                }
              })
            }
          })
        }

        if(obj.update_time) {
          res=res.filter(x=>{
            return obj.update_time.start<x.last_read_date&&x.last_read_date<obj.update_time.end
          })


        }
        if(obj.creation_time){
          res=res.filter(x=>{
            return obj.update_time.start<x.first_read_date&&x.first_read_date<obj.update_time.end
          })
        }
        if(obj.search){
          res=res.filter(x=>{
            return x.title.includes(obj.search)
          })
        }
        return res
          .sort((a, b) => b.last_read_date - a.last_read_date)
          .slice((obj.page_num - 1) * obj.page_size, (obj.page_num) * obj.page_size)
          .map(x => ({
            cover: x.cover,
            id: x.id,
            subTitle: x.subTitle,
            source: x.source,
            title: x.title
          }))
          ;
      },

    },
  ],

)
