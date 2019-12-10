import React, { Component } from 'react'
import { Card, Button, Table, Tag, Modal, Typography, Tooltip } from 'antd'
import { ArticleRequest, } from '../../actions/article'
import moment from 'moment'
import { connect } from 'react-redux'

const mapState = state => {
  const { dataSource, total, isLoading, columns, columnKeys } = state.article
  return { dataSource, total, isLoading, columns, columnKeys }
}
const ButtonGroup = Button.Group
// 在这里，中文类名
const displayTitle = {
  amount: '阅读量',
  author: "作者",
  createAt: '创建时间',
  id: "ID",
  title: '文章名',
}
@connect(mapState, { ArticleRequest })
class ArticleList extends Component {
  constructor() {
    super()
    this.state = {
      offset: 0,
      limited: 10,
      deleteArtTitle: '',
      isShowArtMod: false,
      deleteArtConfirmLoading: false,
      deleteArtID: '',
    }
  }
  // componentDidMount() {
  //   // this.getData()
  //   this.props.ArticleRequest(this.state.offset, this.state.limited)
  // }
  // 将几个相关的方法独立出来写，最后在一个方法中汇总
  createClumns = (columnKeys) => {
    const columns = columnKeys.map(item => {
      if (item === 'amount') {
        return {
          title: displayTitle[item],
          render: (text, record) => {
            const { amount } = record
            return <Tooltip title={amount > 200 ? '很火' : '一般'}><Tag color={amount > 200 ? 'red' : 'green'}>{amount}</Tag></Tooltip>
          },
          key: item
        }
      } else if (item === 'createAt') {
        return {
          title: displayTitle[item],
          render: (text, record) => {
            const { createAt } = record
            return <Tooltip title={record.amount > 200 ? '很火' : '一般'}><Tag color={record.amount > 200 ? 'red' : 'green'}>{moment(createAt).format('YYYY年MM月DD日，HH:mm:ss')}</Tag></Tooltip>
          }
        }
      } else {
        return {
          title: displayTitle[item],
          dataIndex: item,
          key: item
        }
      }
    })
    columns.push({
      title: '操作',
      render: (text, record) => {
        return (
          <ButtonGroup size='small'>
            <Button size='small' type='primary' onClick={this.toEdit.bind(this, record.id)}>编辑</Button>
            <Button size='small' type='danger' onClick={this.deleteArticleMod.bind(this, record)}>删除</Button>
          </ButtonGroup>
        )
      },
      key: 'action'
    })
    return columns
  }

  toEdit = (id) => {
    this.props.history.push(`/admin/Article/Edit/${id}`)
  }

  onPageChange = (page, pageSize) => {
    this.setState({
      offset: pageSize * (page - 1),
      limited: pageSize
    }, () => this.getData())
  }

  onShowSizeChange = (current, size) => {
    // 和产品聊的时候要仔细问清，是要返回第一页还是留在当前页，如果是留在当前页，则 offset: size * (current - 1)
    this.setState({
      offset: 0,
      limited: size
    }, () => this.getData())
  }

  toExcel = () => {
    // 在实际的项目中，是前端发送一个Ajax请求到后端，然后后端返回一个文件下载地址
    console.log('ok')
  }
  deleteArticleMod = (record) => {
    console.log(record)
    this.setState({
      isShowArtMod: true,
      deleteArtTitle: record.title,
      deleteArtID: record.id
    })
    // 使用函数的方式调用，定制化没那么强
    // Modal.confirm({
    //   title: '此操作不可逆，请谨慎！',
    //   content: <Typography>确定要删除<span style={{ color: 'red' }}>{record.title}吗？</span></Typography>,
    //   okType: 'danger',
    //   okText: '别磨叽，赶紧的！',
    //   onOk: () => {
    //     deleteArt(record.id)
    //       .then(resp => {
    //         console.log(resp)
    //       })
    //   }
    // })
  }

  hideDeleteMod = () => {
    this.setState({
      isShowArtMod: false,
      // deleteArtTitle: ''
      deleteArtConfirmLoading: false,
    })
  }

  render() {
    return (
      <div>
        <Card
          title="文章列表"
          bordered={false}
          style={{}}
          extra={<Button onClick={this.toExcel}>导出excel</Button>}
        >
          <Table
            // 给每一项一个key
            rowKey={record => record.id}
            dataSource={this.props.dataSource}
            columns={this.createClumns(this.props.columnKeys)}
            loading={this.props.isLoading}
            pagination={{
              current: this.state.offset / this.state.limited + 1,
              total: this.state.total,
              hideOnSinglePage: true,
              onChange: this.onPageChange,
              showQuickJumper: true,
              showSizeChanger: true,
              onShowSizeChange: this.onShowSizeChange,
            }}
          />
          <Modal
            title='此操作不可逆，请谨慎！'
            visible={this.state.isShowArtMod}
            onCancel={this.hideDeleteMod}
            maskClosable={false}
            onOk={this.deleteArticle}
            confirmLoading={this.state.deleteArtConfirmLoading}
          >
            <Typography>确定要删除<span style={{ color: 'red' }}>{this.state.deleteArtTitle}吗？</span></Typography>
          </Modal>
        </Card>
      </div>
    )
  }
}
export default ArticleList

  // deleteArticle = () => {
  //   this.setState({
  //     deleteArtConfirmLoading: true,
  //   })
  //   deleteArt(this.state.deleteArtID)
  //     .then(resp => {
  //       message.success(resp.data.msg)
  //       // 这里沟通的时候有坑，删除后返回第一页还是当前页
  //       // 返会当前页
  //       // this.getData()
  //       // 返回第一页
  //       this.setState(
  //         {
  //           offset: 0,
  //         },
  //         this.getData()
  //       )
  //     })
  //     .finally(() => {
  //       this.setState({
  //         deleteArtConfirmLoading: false,
  //         // isShowArtMod: false
  //       }, this.hideDeleteMod())
  //     })
  // }

  // getData = () => {
  //   console.log('调用了getData')
  //   this.setState({
  //     isLoading: true
  //   })
  //   getArticles(this.state.offset, this.state.limited)
  //     .then(
  //       resp => {
  //         console.log(resp)
  //         const columnKeys = Object.keys(resp.data.list[0])
  //         const columns = this.createClumns(columnKeys)
  //         // 使用这个方法来防止切换页面速度过快而出现的报错👇，如果请求完成之后组件已经销毁，就不需要 setState
  //         if (!this.updater.isMounted(this)) return
  //         this.setState({
  //           total: resp.data.total,
  //           dataSource: resp.data.list,
  //           columns: columns
  //         })
  //       }
  //     )
  //     .catch(err => {
  //       // 处理错误，虽然有全局错误处理
  //     })
  //     .finally(() => {
  //       // 使用这个方法来防止切换页面速度过快而出现的报错👇，在每个请求数据并修改数据的方法前添加该方法
  //       if (!this.updater.isMounted(this)) return
  //       this.setState({
  //         isLoading: false
  //       })
  //     })
  // }