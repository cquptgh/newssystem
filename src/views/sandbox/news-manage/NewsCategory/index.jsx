import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext
} from "react"
import axios from "axios"
import { Table, Button, Modal, Form, Input } from "antd"
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons"

export default function NewsCategory() {
  const [categoryList, setCategoryList] = useState([])
  const EditableContext = createContext(null)
  //获取分类列表
  useEffect(() => {
    const getCategoryList = async () => {
      const response = await axios.get("/categories")
      const categoryList = response.data
      setCategoryList(categoryList)
    }
    getCategoryList()
  }, [])
  //定义点击删除新闻分类按钮的回调
  const confirmDelete = item => {
    Modal.confirm({
      title: "Do you Want to delete this category?",
      icon: <ExclamationCircleOutlined />,
      content: `分类名称:${item.title}`,
      onOk() {
        deleteCategory(item)
      }
    })
  }
  //定义删除分类的方法
  const deleteCategory = item => {
    //前端数据同步+后台数据同步
    setCategoryList(categoryList.filter(category => category.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  }
  //保存修改
  const handleSave = record => {
    setCategoryList(
      categoryList.map(category => {
        if (category.id === record.id) {
          return {
            id: record.id,
            title: record.title,
            value: record.title
          }
        }
        return category
      })
    )
    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.title
    })
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: id => {
        return <b>{id}</b>
      }
    },
    {
      title: "栏目名称",
      dataIndex: "title",
      onCell: record => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "栏目名称",
        handleSave
      }),
      width: 500
    },
    {
      title: "操作",
      render: item => {
        return (
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(item)}
          />
        )
      }
    }
  ]
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef(null)
    const form = useContext(EditableContext)
    useEffect(() => {
      if (editing) {
        inputRef.current.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex]
      })
    }

    const save = async () => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        console.log("Save failed:", errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`
            }
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
            cursor: "pointer"
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }

  return (
    <Table
      dataSource={categoryList}
      columns={columns}
      pagination={{ pageSize: 5 }}
      rowKey={item => item.id}
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell
        }
      }}
    />
  )
}
