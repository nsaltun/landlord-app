import React, { useState } from 'react';
import {
  Layout,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Spin,
  Alert,
  Divider,
  Table,
  // Title,
} from 'antd';
import { calculateData } from './api';
import './App.css'; // Ensure this is imported
import ReactLoading from 'react-loading';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App = () => {
  const [formData, setFormData] = useState({
    emsal: 0.0,
    landSquareMeter: 0.0,
    maxAllowedFlatCount: 0,
    extendFactor: 0.0,
    type: 'All',
  });
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Simple sleep function
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);

    await sleep(1000);

    const formattedData = {
      emsal: parseFloat(formData.emsal) || 0,
      landSquareMeter: parseFloat(formData.landSquareMeter) || 0,
      maxAllowedFlatCount: parseInt(formData.maxAllowedFlatCount, 10) || 0,
      extendFactor: parseFloat(formData.extendFactor) || 0,
      type: formData.type,
    };

    try {
      const data = await calculateData(formattedData);
      setApiResponse(data); // Adjust this based on your API response
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Define table columns for OnePlusOneCount
  const onePlusOneColumns = [
    {
      title: 'Count',
      dataIndex: 'Count',
      key: 'count',
      align: 'center',
    },
    {
      title: 'Size',
      dataIndex: 'Size',
      key: 'size',
      align: 'center',
      render: (size) => `${size.toFixed(2)} m²`, // Format size with two decimal places
    },
  ];

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={2} className="header-title">
          Emsal Hesaplama
        </Title>
      </Header>

      <Content className="app-content">
        <Row
          justify="center" align="middle" className="main-row"
        >
          <Col
            xs={24}
            sm={24}
            md={apiResponse ? 12 : 16}
            lg={apiResponse ? 10 : 12}
            xl={apiResponse ? 8 : 10}
            className="form-col"
          >
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              className="calculation-form"
            >
              <Form.Item label="Emsal" name="emsal" rules={[{ required: true, message: 'Please input Emsal!' }]}>
                <Input
                  placeholder="Emsal"
                  value={formData.emsal}
                  onChange={(e) => handleChange('emsal', e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Arsa Boyutu" name="landSquareMeter" rules={[{ required: true, message: 'Please input Arsa Boyutu!' }]}>
                <Input
                  placeholder="Arsa Boyutu"
                  value={formData.landSquareMeter}
                  onChange={(e) => handleChange('landSquareMeter', e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Max Kat Sayısı" name="maxAllowedFlatCount" rules={[{ required: true, message: 'Please input Max Kat Sayısı!' }]}>
                <Input
                  placeholder="Max Kat Sayısı"
                  value={formData.maxAllowedFlatCount}
                  onChange={(e) => handleChange('maxAllowedFlatCount', e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Çekme Oranı" name="extendFactor" rules={[{ required: true, message: 'Please input Çekme Oranı!' }]}>
                <Input
                  placeholder="Çekme Oranı"
                  value={formData.extendFactor}
                  onChange={(e) => handleChange('extendFactor', e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Select Type" name="type">
                <Select
                  defaultValue="All"
                  onChange={(value) => handleChange('type', value)}
                >
                  <Option value="All">All</Option>
                  <Option value="1+1">1+1</Option>
                  <Option value="2+1">2+1</Option>
                  <Option value="3+1">3+1</Option>
                </Select>
              </Form.Item>

              {/* <Button type="primary" htmlType="submit" block>
                {loading ? <Spin /> : 'Hesapla'}
              </Button>
              // Replace the Spin component with ReactLoading */}
              <Button type="primary" htmlType="submit" block disabled={loading}>
                {loading ? <ReactLoading type="spin" color="#1890ff" height={30} width={30} /> : 'Hesapla'}
              </Button>
            </Form>
            {error && <Alert message="Error" description={error} type="error" showIcon />}
          </Col>
          {apiResponse && (
            <Col xs={24} sm={24} md={12} lg={10} xl={8} className="response-col">
              <Divider />
              <Title level={4}>1+1 Daire Özellikleri</Title>
              <Table
                columns={onePlusOneColumns}
                dataSource={apiResponse.OnePlusOneCount.map((item, index) => ({
                  key: index,
                  ...item,
                }))}
                pagination={false}
              />
              <Divider />
              <Text strong>2+1 Daire Özellikleri:</Text> {apiResponse.TwoPlusOneCount}
              <br />
              <Text strong>3+1 Daire Özellikleri:</Text> {apiResponse.ThreePlusOneCount}
            </Col>
          )}

        </Row>
      </Content>
    </Layout>
  );
};

export default App;
