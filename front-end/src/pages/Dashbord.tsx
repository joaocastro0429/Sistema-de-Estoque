  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import {
    Table,
    Button,
    Form,
    Input,
    Select,
    Modal,
    message,
    Card,
    Space,
    Typography,
    Popconfirm,
    Tag,
    Spin,
    Row,
    Col,
    Divider,

  } from 'antd';
  import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    LogoutOutlined,
    ReloadOutlined,
    FilterOutlined,
    SearchOutlined
  } from '@ant-design/icons';

  const { Title, Text } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;

  interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    user_id: number; // Adicionado user_id
    created_at: string;
    updated_at: string;
  }

  interface NewTask {
    title: string;
    description: string;
    status: string;
    user_id?: number; // Opcional no front, será preenchido pelo backend
  }

  interface FilterValues {
    status?: string;
    search?: string;
  }

  const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState<FilterValues>({});
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();
    const navigate = useNavigate();

    // Opções de status predefinidas
    const statusOptions = [
      { value: 'pendente', label: 'Pendente', color: 'default' },
      { value: 'em progresso', label: 'Em Progresso', color: 'processing' },
      { value: 'concluída', label: 'Concluída', color: 'success' }
    ];

    // Buscar todas as tarefas
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          message.error('Token de autenticação não encontrado');
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:4444/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setTasks(response.data);
        applyFilters(response.data, filters);
        message.success('Tarefas carregadas com sucesso!');
      } catch (err) {
        console.error('Erro ao carregar tarefas:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          message.error('Sessão expirada. Redirecionando para login...');
          localStorage.removeItem('authToken');
          navigate('/');
        } else {
          message.error('Erro ao carregar as tarefas');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Aplicar filtros
    const applyFilters = (tasksToFilter: Task[], filterValues: FilterValues) => {
      let result = [...tasksToFilter];
      
      if (filterValues.status) {
        result = result.filter(task => task.status === filterValues.status);
      }
      
      if (filterValues.search) {
        const searchTerm = filterValues.search.toLowerCase();
        result = result.filter(task => 
          task.title.toLowerCase().includes(searchTerm) || 
          task.description.toLowerCase().includes(searchTerm)
        );
      }
      
      setFilteredTasks(result);
    };

    // Handler para mudança nos filtros
    const handleFilterChange = (changedValues: FilterValues) => {
      const newFilters = { ...filters, ...changedValues };
      setFilters(newFilters);
      applyFilters(tasks, newFilters);
    };

    // Criar nova tarefa
    const handleCreateTask = async (values: NewTask) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        await axios.post(
          'http://localhost:4444/tasks',
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success('Tarefa criada com sucesso!');
        createForm.resetFields();
        await fetchTasks();
      } catch (err) {
        console.error('Erro ao criar tarefa:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          message.error('Sessão expirada. Redirecionando para login...');
          localStorage.removeItem('authToken');
          navigate('/');
        } else {
          message.error('Erro ao criar a tarefa');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Atualizar tarefa
    const handleEditTask = async (values: Task) => {
      if (!editingTask) return;
      
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        await axios.put(
          `http://localhost:4444/tasks/${editingTask.id}`,
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success('Tarefa atualizada com sucesso!');
        setIsModalVisible(false);
        setEditingTask(null);
        form.resetFields();
        await fetchTasks();
      } catch (err) {
        console.error('Erro ao atualizar tarefa:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          message.error('Sessão expirada. Redirecionando para login...');
          localStorage.removeItem('authToken');
          navigate('/');
        } else {
          message.error('Erro ao atualizar a tarefa');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Excluir tarefa
    const handleDeleteTask = async (id: number) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`http://localhost:4444/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Tarefa excluída com sucesso!');
        await fetchTasks();
      } catch (err) {
        console.error('Erro ao excluir tarefa:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          message.error('Sessão expirada. Redirecionando para login...');
          localStorage.removeItem('authToken');
          navigate('/');
        } else {
          message.error('Erro ao excluir a tarefa');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Abrir modal de edição
    const openEditModal = (task: Task) => {
      setEditingTask(task);
      form.setFieldsValue(task);
      setIsModalVisible(true);
    };

    // Fechar modal
    const handleCancel = () => {
      setIsModalVisible(false);
      setEditingTask(null);
      form.resetFields();
    };

    // Resetar filtros
    const resetFilters = () => {
      setFilters({});
      setFilteredTasks(tasks);
    };

    // Logout
    const handleLogout = () => {
      localStorage.removeItem('authToken');
      message.success('Logout realizado com sucesso!');
      navigate('/');
    };

    // Configuração das colunas da tabela
    const columns = [
      {
        title: 'Título',
        dataIndex: 'title',
        key: 'title',
        width: '25%',
        ellipsis: true,
      },
      {
        title: 'Descrição',
        dataIndex: 'description',
        key: 'description',
        width: '30%',
        ellipsis: true,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: (status: string) => {
          const statusConfig = statusOptions.find(opt => opt.value === status);
          return (
            <Tag color={statusConfig?.color || 'default'}>
              {statusConfig?.label || status}
            </Tag>
          );
        },
      },
      {
        title: 'Criado em',
        dataIndex: 'created_at',
        key: 'created_at',
        width: '15%',
        render: (date: string) => new Date(date).toLocaleDateString(),
      },
      {
        title: 'Ações',
        key: 'actions',
        width: '15%',
        render: (_: any, record: Task) => (
          <Space size="small">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => openEditModal(record)}
            >
              Editar
            </Button>
            <Popconfirm
              title="Excluir tarefa"
              description="Tem certeza que deseja excluir esta tarefa?"
              onConfirm={() => handleDeleteTask(record.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                Excluir
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    useEffect(() => {
      fetchTasks();
    }, []);

    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Dashboard de Tarefas
            </Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchTasks}
                loading={isLoading}
              >
                Atualizar
              </Button>
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Filtros */}
        <Card 
          title={
            <Space>
              <FilterOutlined />
              <Text strong>Filtros</Text>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Form
            layout="inline"
            onValuesChange={handleFilterChange}
            initialValues={filters}
          >
            <Row gutter={16} style={{ width: '100%' }}>
              <Col xs={24} md={8}>
                <Form.Item name="status" label="Status">
                  <Select
                    placeholder="Todos status"
                    allowClear
                    style={{ width: '100%' }}
                  >
                    {statusOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="search" label="Busca">
                  <Input
                    placeholder="Buscar por título ou descrição"
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item>
                  <Button onClick={resetFilters} style={{ width: '100%' }}>
                    Limpar Filtros
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Formulário para criar tarefa */}
        <Card 
          title={
            <Space>
              <PlusOutlined />
              <Text strong>Criar Nova Tarefa</Text>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreateTask}
          >
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Título"
                  name="title"
                  rules={[
                    { required: true, message: 'Por favor, insira o título!' },
                    { whitespace: true, message: 'Título não pode estar vazio!' }
                  ]}
                >
                  <Input placeholder="Digite o título da tarefa" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: 'Por favor, selecione o status!' }]}
                >
                  <Select placeholder="Selecione o status">
                    {statusOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label=" " style={{ marginTop: '30px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    loading={isLoading}
                    block
                  >
                    Criar Tarefa
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Descrição"
                  name="description"
                  rules={[
                    { required: true, message: 'Por favor, insira a descrição!' },
                    { whitespace: true, message: 'Descrição não pode estar vazia!' }
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Digite a descrição da tarefa"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Divider />

        {/* Lista de Tarefas */}
        <Card
          title={
            <Space>
              <Text strong>Lista de Tarefas</Text>
              <Text type="secondary">
                ({filteredTasks.length} de {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''})
              </Text>
            </Space>
          }
        >
          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={filteredTasks}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} de ${total} tarefas`,
              }}
              locale={{
                emptyText: (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                      Nenhuma tarefa encontrada
                    </Text>
                    <br />
                    <Text type="secondary">
                      {tasks.length > 0 
                        ? 'Ajuste os filtros ou crie uma nova tarefa' 
                        : 'Crie sua primeira tarefa usando o formulário acima'}
                    </Text>
                  </div>
                ),
              }}
            />
          </Spin>
        </Card>

        {/* Modal de edição */}
        <Modal
          title="Editar Tarefa"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditTask}
          >
            <Form.Item
              label="Título"
              name="title"
              rules={[
                { required: true, message: 'Por favor, insira o título!' },
                { whitespace: true, message: 'Título não pode estar vazio!' }
              ]}
            >
              <Input placeholder="Digite o título da tarefa" />
            </Form.Item>

            <Form.Item
              label="Descrição"
              name="description"
              rules={[
                { required: true, message: 'Por favor, insira a descrição!' },
                { whitespace: true, message: 'Descrição não pode estar vazia!' }
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Digite a descrição da tarefa"
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Por favor, selecione o status!' }]}
            >
              <Select placeholder="Selecione o status">
                {statusOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Atualizar Tarefa
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  export { Dashboard };