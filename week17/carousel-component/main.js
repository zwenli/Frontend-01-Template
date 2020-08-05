import {createElement, Text, Wrapper} from './createElement'
import {Timeline, Animation} from './animation'
import { ease } from './cubicBezier'
import { Carousel } from './Carousel'
import { Panel } from './Panel'
import { TabPanel } from './TabPanel'
import { ListView } from './ListView'

// import Carousel from './carousel.view'



const component = <Carousel data={[
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]} />
// const component = <Carousel />

component.mountTo(window.document.body)

// console.log(component)
// const panel = <Panel title="this is panel title">
//   <span>this is content</span>
// </Panel>

// panel.mountTo(window.document.body)

// const tabPanel = <TabPanel>
//   <span title="title1">this is content1</span>
//   <span title="title2">this is content2</span>
//   <span title="title3">this is content3</span>
//   <span title="title4">this is content4</span>
// </TabPanel>
// tabPanel.mountTo(window.document.body)

// const data = [
//   {title: '蓝猫', url: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg'},
//   {title: 'B猫', url: "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg"},
//   {title: 'C猫', url: "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg"},
//   {title: 'D猫', url: "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"},
// ]
// const listView = <ListView data={data}>
//   {record => <figure>
//     <img src={record.url}></img>
//     <figcaption>{record.title}</figcaption>
//   </figure>}
// </ListView>
// listView.mountTo(window.document.body)