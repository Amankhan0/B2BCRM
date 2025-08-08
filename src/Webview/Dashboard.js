import React, { useEffect, useState } from 'react'
import DashboardCard from '../Component/DashboardCard';
import { bookmarkIcon, listIcon, messageIcon, orderIcon, usersIcon } from '../SVG/Icons';
import { ApiHit } from '../utils';
import { searchCustomer, searchLead, searchOrder, searchProduct, searchQuotation, searchSupplier } from '../Constants/Constants';

function Dashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    if (data === null) {
      fetchData();
    }
  }, [data]);

  const fetchData = async () => {
    const json = { page: 1, limit: 1, search: {} };
    const newData = {};

    try {
      const [leadRes, quotationRes, orderRes, productRes, customerRes, supplierRes] = await Promise.all([
        ApiHit(json, searchLead),
        ApiHit(json, searchQuotation),
        ApiHit(json, searchOrder),
        ApiHit(json, searchProduct),
        ApiHit(json, searchCustomer),
        ApiHit(json, searchSupplier),
      ]);

      if (leadRes?.content) newData.leads = leadRes.totalElements;
      if (quotationRes?.content) newData.quotations = quotationRes.totalElements;
      if (orderRes?.content) newData.orders = orderRes.totalElements;
      if (productRes?.content) newData.products = productRes.totalElements;
      if (customerRes?.content) newData.customers = customerRes.totalElements;
      if (supplierRes?.content) newData.suppliers = supplierRes.totalElements;

      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    data !== null &&
    <div className='grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 mt-10 grid-cols-2 gap-4'>
      <div>
        <DashboardCard TotalNum={data.quotations} Icon={messageIcon} Title={'Total Quotations'} />
      </div>
      <div>
        <DashboardCard TotalNum={data.leads} Icon={listIcon} Title={'Total Leads'} />
      </div>
      <div>
        <DashboardCard TotalNum={data.orders} Icon={orderIcon} Title={'Total Orders'} />
      </div>
      <div>
        <DashboardCard TotalNum={data.products} Icon={bookmarkIcon} Title={'Total Product'} />
      </div>
      <div>
        <DashboardCard TotalNum={data.customers} Icon={usersIcon} Title={'Total Customers'} />
      </div>
      <div>
        <DashboardCard TotalNum={data.suppliers} Icon={usersIcon} Title={'Total Supplier'} />
      </div>
    </div>
  )
}

export default Dashboard;