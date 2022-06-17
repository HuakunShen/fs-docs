import * as React from 'react';
import { Button } from 'antd';
import Layout from '../components/layout';

const App = () => (
  <Layout pageTitle="Index Page">
    <div className="App">
      <Button type="primary">Button</Button>
      <h1 className='text-red-500 text-3xl'>Hello</h1>
    </div>
  </Layout>
);

export default App;
