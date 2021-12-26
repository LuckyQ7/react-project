import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// 组件
import NavHeader from "../../../../components/NavHeader";
import HouseSupportings from "../../../../components/HouseSupportings";
import PickFooter from "../../../../components/PickerFooter/index";
// API
import { uploadImage, renterAdd } from "../../../../api/Rent";
// 第三方组件
import {
  WingBlank,
  Flex,
  InputItem,
  Picker,
  List,
  WhiteSpace,
  ImagePicker,
  TextareaItem,
  Toast,
} from "antd-mobile";
// CSS
import styles from "./index.module.css";
// 房屋类型
const roomTypeData = [
  { label: "一室", value: "ROOM|d4a692e4-a177-37fd" },
  { label: "二室", value: "ROOM|d1a00384-5801-d5cd" },
  { label: "三室", value: "ROOM|20903ae0-c7bc-f2e2" },
  { label: "四室", value: "ROOM|ce2a5daa-811d-2f49" },
  { label: "四室+", value: "ROOM|2731c38c-5b19-ff7f" },
];
// 朝向：
const orientedData = [
  { label: "东", value: "ORIEN|141b98bf-1ad0-11e3" },
  { label: "西", value: "ORIEN|103fb3aa-e8b4-de0e" },
  { label: "南", value: "ORIEN|61e99445-e95e-7f37" },
  { label: "北", value: "ORIEN|caa6f80b-b764-c2df" },
  { label: "东南", value: "ORIEN|dfb1b36b-e0d1-0977" },
  { label: "东北", value: "ORIEN|67ac2205-7e0f-c057" },
  { label: "西南", value: "ORIEN|2354e89e-3918-9cef" },
  { label: "西北", value: "ORIEN|80795f1a-e32f-feb9" },
];
// 楼层
const floorData = [
  { label: "高楼层", value: "FLOOR|1" },
  { label: "中楼层", value: "FLOOR|2" },
  { label: "低楼层", value: "FLOOR|3" },
];
export default function RentAdd() {
  const [supports, setSupports] = useState([]);
  const [roomType, setRoomType] = useState([]);
  const [floorType, setFloorType] = useState([]);
  const [orient, setOrient] = useState([]);
  const [files, setFiles] = useState([]);
  const [price, setPrice] = useState();
  const [acreage, setAcrege] = useState(); // 面积
  const [desc, setDesc] = useState();
  const [title, setTitle] = useState();
  const [imgList, setimgList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  // 更新房屋配置
  function upDateSupports(data) {
    setSupports(data);
  }
  // 图片上传
  async function handleImgChange(files, type, index) {
    try {
      setFiles(files);
      const temp = imgList;
      if (index >= 0) {
        temp.splice(index, 1);
      } else {
        let data = new FormData();
        data.append("file", files[files.length - 1].file);
        const { data: res } = await uploadImage(data);
        temp.push(res.body);
      }
      setimgList(temp);
    } catch (error) {
      console.log(error);
    }
  }

  // 确定发布
  async function handleRentAdd() {
    try {
      const body = {
        title,
        description: desc,
        houseImg: imgList.join("|"),
        oriented: orient.join(" "),
        supporting: supports.join("|"),
        price,
        roomType: roomType.join(" "),
        size: acreage,
        floor: floorType.join(" "),
        community: state ? state.value : "",
      };
      const { data: res } = await renterAdd(body);
      if (res.status === 400) {
        navigate("/login");
      } else if (res.status === 200) {
        Toast.info("发布成功");
        navigate("/renter");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={styles.rentAdd}>
      <NavHeader navBar={styles.navBar}>发布房源</NavHeader>
      <WingBlank>
        <div className={styles.item}>
          <WhiteSpace />
          <h1 className={styles.title}>房源信息</h1>
          <WhiteSpace />
        </div>

        {/* 名字 */}
        <div className={styles.item}>
          <Flex
            justify="between"
            onClick={() => {
              navigate("/renter/searchList");
            }}
          >
            <h1>小区名字</h1>
            <h1>
              <span className={styles.backRit}>
                {state ? state.name : ""}{" "}
                <i className="iconfont icon-backRit"></i>
              </span>
            </h1>
          </Flex>
        </div>
        {/* 价格 */}
        <div className={styles.item}>
          <InputItem
            placeholder="请输入租金/月"
            extra="¥/月"
            className={styles.price}
            type="money"
            value={price}
            onChange={(v) => {
              setPrice(v);
            }}
          >
            <span>价</span>
            <span>格</span>
          </InputItem>
        </div>
        {/* 面积 */}
        <div className={styles.item}>
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            type="money"
            value={acreage}
            onChange={(v) => {
              setAcrege(v);
            }}
          >
            建筑面积
          </InputItem>
        </div>
        {/* 户型 */}
        <div className={styles.item}>
          <Picker
            data={roomTypeData}
            cols={1}
            value={roomType}
            onOk={(value) => setRoomType(value)}
          >
            <List.Item arrow="horizontal" extra={"请选择"}>
              户{"       ".replace(/ /g, "\u00a0")}型
            </List.Item>
          </Picker>
        </div>
        {/* 楼层 */}
        <div className={styles.item}>
          <Picker
            data={floorData}
            cols={1}
            value={floorType}
            onOk={(value) => setFloorType(value)}
          >
            <List.Item arrow="horizontal" extra={"请选择"}>
              所在楼层
            </List.Item>
          </Picker>
        </div>
        {/* 朝向 */}
        <div className={styles.item}>
          <Picker
            data={orientedData}
            cols={1}
            onOk={(v) => setOrient(v)}
            value={orient}
          >
            <List.Item arrow="horizontal" extra="extra content">
              朝{"       ".replace(/ /g, "\u00a0")}向
            </List.Item>
          </Picker>
        </div>
        <div className={styles.item}>
          <WhiteSpace />
          <h1>房屋标题</h1>
          <WhiteSpace />
        </div>
        {/* 标题 */}
        <div className={styles.item}>
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(v) => setTitle(v)}
          />
        </div>
        <div className={styles.item}>
          <WhiteSpace />
          <h1>房屋图像</h1>
          <WhiteSpace />
        </div>
        {/* 房屋图片 */}
        <div className={styles.item}>
          <ImagePicker
            files={files}
            onChange={handleImgChange}
            selectable={files.length < 7}
            multiple={true}
            onImageClick={(index, fs) => console.log(index, fs)}
            accept="image/gif,image/jpeg,image/jpg,image/png"
          />
        </div>
        <div className={styles.item}>
          <WhiteSpace />
          <h1>房屋配置</h1>
          <WhiteSpace />
          <HouseSupportings upDateSupports={upDateSupports} />
        </div>
        {/* 房屋描述 */}
        <div className={styles.item}>
          <WhiteSpace />
          <h1>房屋描述</h1>
          <WhiteSpace />
        </div>
        <TextareaItem
          rows={3}
          placeholder="请输入房屋描述信息"
          value={desc}
          onChange={(v) => setDesc(v)}
        />
      </WingBlank>
      <PickFooter type={"rent"} handleRentAdd={handleRentAdd} rentFooter={true}>
        取消
      </PickFooter>
    </div>
  );
}
