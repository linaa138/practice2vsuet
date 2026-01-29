import React, { useState, useEffect } from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Table } from '@consta/uikit/Table';
import { Text } from '@consta/uikit/Text';
import { Layout } from '@consta/uikit/Layout';
import { Button } from '@consta/uikit/Button';
import { Card } from '@consta/uikit/Card';
import { TextField } from '@consta/uikit/TextField'; // Добавил красивые поля от Consta
import { IconTrash } from '@consta/icons/IconTrash';

function App() {
  const [data, setData] = useState([]);
  const [view, setView] = useState('customers');

  const [newCustomer, setNewCustomer] = useState({
    customer_code: '',
    customer_name: '',
    customer_inn: '',
    customer_kpp: '',
    person_type: '',
    postal_address: '',
    email: ''
  });

  const [newLot, setNewLot] = useState({
      lot_code: '',
      lot_name: '',
      price: '',
      currency: 'RUB',
      delivery_date: ''
    });

  const customerColumns = [
    { title: 'Код', accessor: 'customer_code' },
    { title: 'Наименование', accessor: 'customer_name' },
    { title: 'ИНН', accessor: 'customer_inn' },
    { title: 'КПП', accessor: 'customer_kpp' },
    { title: 'Тип лица', accessor: 'person_type' },
    { title: 'Адрес', accessor: 'postal_address' },
    { title: 'Email', accessor: 'email' },
    {
      title: 'Удалить',
      accessor: 'customer_code',
      renderCell: (row) => (
        <Button
          onlyIcon iconLeft={IconTrash} size="s" view="ghost"
          onClick={() => deleteItem(row.customer_code)}
        />
      )
    }
  ];

  const lotColumns = [
      { title: 'Код лота', accessor: 'lot_code' },
      { title: 'Наименование', accessor: 'lot_name' },
      { title: 'Цена', accessor: 'price' },
      { title: 'Валюта', accessor: 'currency' },
      { title: 'Дата доставки', accessor: 'delivery_date' },
      {
        title: 'Удалить',
        accessor: 'lot_code',
        renderCell: (row) => (
          <Button
            onlyIcon iconLeft={IconTrash} size="s" view="ghost"
            onClick={() => deleteItem(row.lot_code)}
          />
        )
      }
    ];

  const loadData = () => {
    const endpoint = view === 'customers' ? '/api/customers' : '/api/lots';
    fetch(`http://localhost:8080${endpoint}`)
      .then(res => res.json())
      .then(json => setData(Array.isArray(json) ? json : []))
      .catch(err => {
        console.error("Ошибка:", err);
        setData([]);
      });
  };

  useEffect(() => { loadData(); }, [view]);

    const deleteItem = (code) => {
      if (!code) return;

      // Определяем, куда слать запрос в зависимости от текущей вкладки
      const endpoint = view === 'customers' ? `/api/customers/${code}` : `/api/lots/${code}`;

      if (window.confirm(`Удалить запись ${code}?`)) {
        fetch(`http://localhost:8080${endpoint}`, {
          method: 'DELETE'
        })
        .then(res => {
          if (res.ok) {
            loadData();
          } else {
            alert("Ошибка на сервере при удалении");
          }
        })
        .catch(err => console.error("Ошибка связи:", err));
      }
    };


        const addItem = () => {
          const isLot = view === 'lots';
          // Проверяем, что мы берем правильный объект данных
          const body = isLot ? newLot : newCustomer;
          const endpoint = isLot ? '/api/lots' : '/api/customers';

          console.log("Шлем данные:", body); // Это покажет в консоли браузера (F12), что улетает

          fetch(`http://localhost:8080${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          })
          .then(res => {
            if (res.ok) {
              loadData();
              // Очистка полей
              if (isLot) {
                setNewLot({ lot_code: '', lot_name: '', price: '', currency: 'RUB', delivery_date: '' });
              } else {
                setNewCustomer({ customer_code: '', customer_name: '', customer_inn: '', customer_kpp: '', person_type: '', postal_address: '', email: '' });
              }
            } else {
              alert("Сервер вернул ошибку! Проверь консоль IDEA");
            }
          })
          .catch(err => console.error("Ошибка связи с сервером:", err));
        };




  return (
    <Theme preset={presetGpnDefault}>
      <Layout direction="column" style={{ minHeight: '100vh', background: '#F4F5F7' }}>

        <header style={{ background: '#002033', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text size="l" weight="bold" style={{ color: 'white' }}>СИСТЕМА ЗАКУПОК 2026</Text>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button label="Контрагенты" view={view === 'customers' ? 'primary' : 'ghost'} size="s" onClick={() => setView('customers')} />
            <Button label="Лоты" view={view === 'lots' ? 'primary' : 'ghost'} size="s" onClick={() => setView('lots')} />
          </div>
        </header>

        <main style={{ padding: '40px' }}>
          <Text size="2xl" weight="bold" margin={{ bottom: 'm' }}>
            {view === 'customers' ? 'Контрагенты' : 'Лоты'}
          </Text>

          {view === 'customers' && (
            <Card style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end', background: '#fff' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Text size="xs" view="secondary">Код</Text>
                <input
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  value={newCustomer.customer_code}
                  onChange={(e) => setNewCustomer({ ...newCustomer, customer_code: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Text size="xs" view="secondary">Наименование</Text>
                <input
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  value={newCustomer.customer_name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, customer_name: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Text size="xs" view="secondary">ИНН</Text>
                <input
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  value={newCustomer.customer_inn}
                  onChange={(e) => setNewCustomer({ ...newCustomer, customer_inn: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <Text size="xs" view="secondary">КПП</Text>
                                <input style={{ padding: '8px' }} value={newCustomer.customer_kpp} onChange={(e) => setNewCustomer({ ...newCustomer, customer_kpp: e.target.value })} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <Text size="xs" view="secondary">Тип лица</Text>
                                <input style={{ padding: '8px' }} value={newCustomer.person_type} onChange={(e) => setNewCustomer({ ...newCustomer, person_type: e.target.value })} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <Text size="xs" view="secondary">Адрес</Text>
                                <input style={{ padding: '8px' }} value={newCustomer.postal_address} onChange={(e) => setNewCustomer({ ...newCustomer, postal_address: e.target.value })} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <Text size="xs" view="secondary">Email</Text>
                                <input style={{ padding: '8px' }} value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                              </div>
              <Button label="Добавить" size="m" onClick={addItem} />
            </Card>
          )}

          {view === 'lots' && (
            <Card style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{display:'flex', flexDirection:'column'}}>
                <Text size="xs">Код</Text>
                <input value={newLot.lot_code} onChange={e => setNewLot({...newLot, lot_code: e.target.value})} style={{padding:'5px'}} />
              </div>
              <div style={{display:'flex', flexDirection:'column'}}>
                <Text size="xs">Наименование</Text>
                <input value={newLot.lot_name} onChange={e => setNewLot({...newLot, lot_name: e.target.value})} style={{padding:'5px'}} />
              </div>
              <div style={{display:'flex', flexDirection:'column'}}>
                <Text size="xs">Стоимость</Text>
                <input type="number" value={newLot.price} onChange={e => setNewLot({...newLot, price: e.target.value})} style={{padding:'5px'}} />
              </div>
              <div style={{display:'flex', flexDirection:'column'}}>
                <Text size="xs">Валюта</Text>
                <input value={newLot.currency} onChange={e => setNewLot({...newLot, currency: e.target.value})} style={{padding:'5px'}} />
              </div>
              <div style={{display:'flex', flexDirection:'column'}}>
                <Text size="xs">Дата доставки</Text>
                <input type="date" value={newLot.delivery_date} onChange={e => setNewLot({...newLot, delivery_date: e.target.value})} style={{padding:'5px'}} />
              </div>
              <Button label="Добавить лот" onClick={addItem} />
            </Card>
          )}


          <Card style={{ padding: '20px' }}>
            {data.length > 0 ? (
              <Table rows={data} columns={view === 'customers' ? customerColumns : lotColumns} borderBetweenRows zebraStriped="odd" />
            ) : (
              <Text view="ghost" align="center" style={{ padding: '40px' }}>Данных нет. Проверьте базу или бэкенд.</Text>
            )}
          </Card>
        </main>

      </Layout>
    </Theme>
  );
}

export default App;
