import {
  Space,
  Layout,
  Form,
  Input,
  Divider,
  Button,
  notification,
  Table,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import carRegisteryABI from "./carRegistryABI.json";
import { ethers } from "ethers";

const { Header, Content } = Layout;
const { Search } = Input;

function App() {
  const [form] = Form.useForm();
  const [transferForm] = Form.useForm();

  const [contractDetail, setContractDetail] = useState(null);
  const [carDetails, setCarDetails] = useState([]);
  const [defaultTab, setDefaultTab] = useState("1");

  const items = [
    {
      key: "1",
      label: `Search Car Details`,
    },
    {
      key: "2",
      label: `Add New Car`,
    },
    {
      key: "3",
      label: `Transfer Car`,
    },
  ];

  const connectContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const contract = new ethers.Contract(address, carRegisteryABI, signer);
    setContractDetail(contract);
  };

  useEffect(() => {
    connectContract();
  }, []);

  const onFormFinish = async ({ number, model, maker }) => {
    try {
      await contractDetail.setCar(number, model, maker);
      notification.open({
        message: "Success",
        description: "Car Detail Added Success",
      });
      form.resetFields();
    } catch (error) {
      notification.open({
        message: "Error",
        description: `${error.reason}`,
      });
    }
  };

  const onSearch = async (carNo) => {
    try {
      const carDetail = await contractDetail.getCar(carNo);
      const tempArr = [
        {
          owner: carDetail[0],
          number: carDetail[1],
          model: carDetail[2],
          maker: carDetail[3],
        },
      ];
      setCarDetails(tempArr);
    } catch (error) {
      notification.open({
        message: "Error",
        description: `${error.reason}`,
      });
    }
  };

  const onTransferCar = async ({ number, address }) => {
    try {
      await contractDetail.transferCarOwner(address, number);
      notification.open({
        message: "Success",
        description: "Car Transfer Success",
      });
      transferForm.resetFields();
    } catch (error) {
      notification.open({
        message: "Error",
        description: `${error.reason}`,
      });
    }
  };

  const onChange = (key) => {
    setDefaultTab(key);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
      <Layout>
        <Header style={headerStyle}>Smart Contract</Header>
        <Content style={contentStyle}>
          <Tabs
            defaultActiveKey={defaultTab}
            items={items}
            onChange={onChange}
          />
          {defaultTab === "2" && (
            <>
              <Divider orientation="left">Add Car Details</Divider>
              <Form form={form} layout="vertical" onFinish={onFormFinish}>
                <Form.Item
                  label="Car Registration No."
                  name="number"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="E.g: 123" />
                </Form.Item>
                <Form.Item
                  label="Car Model"
                  name="model"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g: 2022" />
                </Form.Item>
                <Form.Item
                  label="Car Maker"
                  name="maker"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g: Honda" />
                </Form.Item>
                <Button htmlType="submit">Submit</Button>
              </Form>
            </>
          )}
          {defaultTab === "1" && (
            <>
              <Divider orientation="left">Get Cart Details</Divider>
              <Search
                placeholder="Enter Car number"
                allowClear
                onSearch={onSearch}
                style={{ width: 304 }}
              />
              <Table
                columns={[
                  {
                    title: "Owner",
                    dataIndex: "owner",
                    key: "owner",
                  },
                  {
                    title: "Car Number",
                    dataIndex: "number",
                    key: "number",
                  },
                  {
                    title: "Car Model",
                    dataIndex: "model",
                    key: "model",
                  },
                  {
                    title: "Car Maker",
                    dataIndex: "maker",
                    key: "maker",
                  },
                ]}
                dataSource={carDetails}
              />
            </>
          )}
          {defaultTab === "3" && (
            <>
              <Divider orientation="left">Change Car Owner</Divider>
              <Form
                form={transferForm}
                layout="vertical"
                onFinish={onTransferCar}
              >
                <Form.Item
                  label="Car Registration No."
                  name="number"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="E.g: 123" />
                </Form.Item>
                <Form.Item
                  label="New Owner Address"
                  name="address"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g: 0x0000000000" />
                </Form.Item>
                <Button htmlType="submit">Transfer</Button>
              </Form>
            </>
          )}
        </Content>
      </Layout>
    </Space>
  );
}

export default App;

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "#7dbcea",
};

const contentStyle = {
  padding: "30px",
  textAlign: "center",
  minHeight: "80%",
  lineHeight: "120px",
};
