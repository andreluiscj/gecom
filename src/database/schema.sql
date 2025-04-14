
-- GECOM - Public Procurement Management System Schema
-- PostgreSQL database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== Base Tables ==========

-- Municipalities
CREATE TABLE municipalities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    population INTEGER,
    budget DECIMAL(15,2),
    annual_budget DECIMAL(15,2),
    mayor VARCHAR(100),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_municipalities_name ON municipalities(name);

-- Secretariats (Departments)
CREATE TABLE secretariats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    budget DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(municipality_id, name)
);

CREATE INDEX idx_secretariats_municipality ON secretariats(municipality_id);

-- Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_role_name CHECK (name IN ('Administrador', 'Prefeito', 'Gestor', 'Servidor'))
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('Administrador', 'Full system access'),
('Prefeito', 'Mayor with approval authority'),
('Gestor', 'Department manager'),
('Servidor', 'Regular municipal employee');

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    birth_date DATE,
    role_id UUID NOT NULL REFERENCES roles(id),
    active BOOLEAN DEFAULT TRUE,
    hire_date DATE,
    first_access BOOLEAN DEFAULT TRUE,
    phone VARCHAR(20),
    profile_picture_url TEXT,
    gdpr_consent_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);

-- User-Secretariat Relationship
CREATE TABLE user_secretariats (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    secretariat_id UUID NOT NULL REFERENCES secretariats(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, secretariat_id)
);

CREATE INDEX idx_user_secretariats_user ON user_secretariats(user_id);
CREATE INDEX idx_user_secretariats_secretariat ON user_secretariats(secretariat_id);

-- Monetary Funds
CREATE TABLE funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    secretariat_id UUID NOT NULL REFERENCES secretariats(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    annual_budget DECIMAL(15,2),
    remaining_budget DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_funds_secretariat ON funds(secretariat_id);

-- ========== Purchase Request Related Tables ==========

-- Purchase Request Status
CREATE TABLE request_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    order_sequence INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default statuses
INSERT INTO request_statuses (name, description, order_sequence) VALUES
('Pendente', 'Solicitação inicial, aguardando análise', 1),
('Em Análise', 'Em processo de análise pelos responsáveis', 2),
('Aprovado', 'Aprovado para prosseguimento', 3),
('Em Andamento', 'Processo de compra em andamento', 4),
('Concluído', 'Processo finalizado com sucesso', 5),
('Rejeitado', 'Solicitação rejeitada', 6);

-- Purchase Requests
CREATE TABLE purchase_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(20) NOT NULL,
    secretariat_id UUID NOT NULL REFERENCES secretariats(id),
    fund_id UUID NOT NULL REFERENCES funds(id),
    requester_id UUID NOT NULL REFERENCES users(id),
    responsible_id UUID REFERENCES users(id),
    description TEXT NOT NULL,
    justification TEXT NOT NULL,
    request_date DATE NOT NULL,
    total_estimated_value DECIMAL(15,2) NOT NULL,
    total_contracted_value DECIMAL(15,2),
    status_id UUID NOT NULL REFERENCES request_statuses(id),
    delivery_location TEXT,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_values CHECK (total_contracted_value IS NULL OR total_contracted_value >= 0)
);

CREATE INDEX idx_purchase_requests_secretariat ON purchase_requests(secretariat_id);
CREATE INDEX idx_purchase_requests_fund ON purchase_requests(fund_id);
CREATE INDEX idx_purchase_requests_requester ON purchase_requests(requester_id);
CREATE INDEX idx_purchase_requests_status ON purchase_requests(status_id);
CREATE UNIQUE INDEX idx_purchase_requests_number ON purchase_requests(request_number);

-- Purchase Request Items
CREATE TABLE request_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_request_id UUID NOT NULL REFERENCES purchase_requests(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    unit_value DECIMAL(15,2) NOT NULL,
    total_value DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_value) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_quantity CHECK (quantity > 0),
    CONSTRAINT chk_unit_value CHECK (unit_value >= 0)
);

CREATE INDEX idx_request_items_purchase ON request_items(purchase_request_id);

-- Workflow Steps
CREATE TABLE workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    order_sequence INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default workflow steps
INSERT INTO workflow_steps (name, description, order_sequence) VALUES
('Aprovação da DFD', 'Documento de Formalização de Demanda', 1),
('Criação da ETP', 'Estudo Técnico Preliminar', 2),
('Criação do TR', 'Termo de Referência', 3),
('Pesquisa de Preços', 'Cotações e valores de mercado', 4),
('Parecer Jurídico', 'Análise jurídica do processo', 5),
('Edital', 'Preparação e publicação do edital', 6),
('Sessão Licitação', 'Realização do certame', 7),
('Recursos', 'Análise de recursos apresentados', 8),
('Homologação', 'Homologação do processo', 9);

-- Purchase Request Workflow
CREATE TABLE request_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_request_id UUID NOT NULL REFERENCES purchase_requests(id) ON DELETE CASCADE,
    workflow_step_id UUID NOT NULL REFERENCES workflow_steps(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pendente', 'Em Andamento', 'Concluído')),
    start_date TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    responsible_id UUID REFERENCES users(id),
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(purchase_request_id, workflow_step_id)
);

CREATE INDEX idx_request_workflows_purchase ON request_workflows(purchase_request_id);
CREATE INDEX idx_request_workflows_step ON request_workflows(workflow_step_id);
CREATE INDEX idx_request_workflows_responsible ON request_workflows(responsible_id);

-- ========== Task Management ==========

-- Task Status
CREATE TABLE task_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    order_sequence INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default task statuses
INSERT INTO task_statuses (name, description, order_sequence) VALUES
('Pendente', 'Tarefa ainda não iniciada', 1),
('Em Progresso', 'Tarefa em andamento', 2),
('Concluída', 'Tarefa finalizada', 3);

-- Task Priorities
CREATE TABLE task_priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default priorities
INSERT INTO task_priorities (name, description, level) VALUES
('Baixa', 'Prioridade baixa', 1),
('Média', 'Prioridade média', 2),
('Alta', 'Prioridade alta', 3);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    secretariat_id UUID NOT NULL REFERENCES secretariats(id),
    purchase_request_id UUID REFERENCES purchase_requests(id) ON DELETE SET NULL,
    status_id UUID NOT NULL REFERENCES task_statuses(id),
    priority_id UUID NOT NULL REFERENCES task_priorities(id),
    assigned_to UUID REFERENCES users(id),
    due_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    requires_attachment BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_secretariat ON tasks(secretariat_id);
CREATE INDEX idx_tasks_purchase_request ON tasks(purchase_request_id);
CREATE INDEX idx_tasks_status ON tasks(status_id);
CREATE INDEX idx_tasks_priority ON tasks(priority_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);

-- File Attachments
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Task Attachments
CREATE TABLE task_attachments (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    attachment_id UUID NOT NULL REFERENCES attachments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, attachment_id)
);

-- Purchase Request Attachments
CREATE TABLE request_attachments (
    purchase_request_id UUID NOT NULL REFERENCES purchase_requests(id) ON DELETE CASCADE,
    attachment_id UUID NOT NULL REFERENCES attachments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (purchase_request_id, attachment_id)
);

-- ========== Activity Tracking & Notifications ==========

-- Activity History Types
CREATE TABLE activity_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default activity types
INSERT INTO activity_types (name, description) VALUES
('Criação', 'Criação de um novo registro'),
('Atualização', 'Atualização de um registro existente'),
('Alteração de Status', 'Mudança de status em um processo'),
('Comentário', 'Adição de um comentário'),
('Anexo', 'Adição de um anexo'),
('Remoção', 'Remoção de um registro');

-- Activity History
CREATE TABLE activity_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_type_id UUID NOT NULL REFERENCES activity_types(id),
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    description TEXT NOT NULL,
    previous_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_history_entity ON activity_history(entity_type, entity_id);
CREATE INDEX idx_activity_history_user ON activity_history(user_id);
CREATE INDEX idx_activity_history_type ON activity_history(activity_type_id);
CREATE INDEX idx_activity_history_created_at ON activity_history(created_at);

-- Notification Types
CREATE TABLE notification_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default notification types
INSERT INTO notification_types (name, description) VALUES
('Tarefa Atribuída', 'Uma nova tarefa foi atribuída'),
('Tarefa Concluída', 'Uma tarefa foi concluída'),
('Pedido Atualizado', 'Um pedido foi atualizado'),
('Pedido Aprovado', 'Um pedido foi aprovado'),
('Pedido Rejeitado', 'Um pedido foi rejeitado'),
('Etapa Concluída', 'Uma etapa do workflow foi concluída'),
('Comentário', 'Um comentário foi adicionado'),
('Prazo Próximo', 'O prazo está se aproximando');

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_type_id UUID NOT NULL REFERENCES notification_types(id),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_entity ON notifications(entity_type, entity_id);

-- ========== Comments ==========

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comments_user ON comments(user_id);

-- ========== Views ==========

-- View for Purchase Requests with Status Information
CREATE VIEW vw_purchase_requests AS
SELECT 
    pr.id,
    pr.request_number,
    pr.description,
    pr.justification,
    pr.request_date,
    pr.total_estimated_value,
    pr.total_contracted_value,
    s.id AS secretariat_id,
    s.name AS secretariat_name,
    f.id AS fund_id,
    f.name AS fund_name,
    u.id AS requester_id,
    u.name AS requester_name,
    rs.id AS status_id,
    rs.name AS status_name,
    m.id AS municipality_id,
    m.name AS municipality_name,
    pr.delivery_location,
    pr.observations,
    pr.created_at,
    pr.updated_at
FROM 
    purchase_requests pr
JOIN secretariats s ON pr.secretariat_id = s.id
JOIN funds f ON pr.fund_id = f.id
JOIN users u ON pr.requester_id = u.id
JOIN request_statuses rs ON pr.status_id = rs.id
JOIN municipalities m ON s.municipality_id = m.id;

-- View for Tasks with Status and Priority Information
CREATE VIEW vw_tasks AS
SELECT 
    t.id,
    t.title,
    t.description,
    s.id AS secretariat_id,
    s.name AS secretariat_name,
    ts.id AS status_id,
    ts.name AS status_name,
    tp.id AS priority_id,
    tp.name AS priority_name,
    u.id AS assigned_to_id,
    u.name AS assigned_to_name,
    t.due_date,
    t.progress,
    t.requires_attachment,
    pr.id AS purchase_request_id,
    pr.request_number,
    m.id AS municipality_id,
    m.name AS municipality_name,
    t.created_at,
    t.updated_at
FROM 
    tasks t
JOIN secretariats s ON t.secretariat_id = s.id
JOIN task_statuses ts ON t.status_id = ts.id
JOIN task_priorities tp ON t.priority_id = tp.id
LEFT JOIN users u ON t.assigned_to = u.id
LEFT JOIN purchase_requests pr ON t.purchase_request_id = pr.id
JOIN municipalities m ON s.municipality_id = m.id;

-- View for Workflow Stages with Request Information
CREATE VIEW vw_request_workflow AS
SELECT 
    rw.id,
    pr.id AS purchase_request_id,
    pr.request_number,
    ws.id AS workflow_step_id,
    ws.name AS workflow_step_name,
    ws.order_sequence,
    rw.status,
    rw.start_date,
    rw.completion_date,
    u.id AS responsible_id,
    u.name AS responsible_name,
    rw.observations,
    pr.secretariat_id,
    s.name AS secretariat_name,
    m.id AS municipality_id,
    m.name AS municipality_name
FROM 
    request_workflows rw
JOIN purchase_requests pr ON rw.purchase_request_id = pr.id
JOIN workflow_steps ws ON rw.workflow_step_id = ws.id
LEFT JOIN users u ON rw.responsible_id = u.id
JOIN secretariats s ON pr.secretariat_id = s.id
JOIN municipalities m ON s.municipality_id = m.id
ORDER BY 
    pr.id, ws.order_sequence;

-- ========== Functions & Triggers ==========

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for timestamp updates
DO $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'municipalities', 'secretariats', 'users', 'purchase_requests', 
            'request_items', 'request_workflows', 'tasks', 'comments'
        )
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_timestamp
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        ', table_name, table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to log activity history
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
    activity_type_id UUID;
    description TEXT;
    previous_value JSONB := NULL;
    new_value JSONB := NULL;
BEGIN
    -- Determine activity type
    IF TG_OP = 'INSERT' THEN
        SELECT id INTO activity_type_id FROM activity_types WHERE name = 'Criação';
        description := 'Novo registro criado';
        new_value := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        -- Check if it's a status change
        IF TG_TABLE_NAME = 'purchase_requests' AND OLD.status_id != NEW.status_id THEN
            SELECT id INTO activity_type_id FROM activity_types WHERE name = 'Alteração de Status';
            description := 'Status do pedido alterado';
        ELSE
            SELECT id INTO activity_type_id FROM activity_types WHERE name = 'Atualização';
            description := 'Registro atualizado';
        END IF;
        previous_value := to_jsonb(OLD);
        new_value := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        SELECT id INTO activity_type_id FROM activity_types WHERE name = 'Remoção';
        description := 'Registro removido';
        previous_value := to_jsonb(OLD);
    END IF;

    -- Insert activity log
    INSERT INTO activity_history (
        activity_type_id, 
        user_id,
        entity_type,
        entity_id,
        description,
        previous_value,
        new_value
    ) VALUES (
        activity_type_id,
        COALESCE(current_setting('app.current_user_id', true)::UUID, '00000000-0000-0000-0000-000000000000'::UUID),
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        description,
        previous_value,
        new_value
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create notifications for task assignees
CREATE OR REPLACE FUNCTION notify_task_assignment()
RETURNS TRIGGER AS $$
DECLARE
    notification_type_id UUID;
BEGIN
    -- Only proceed if the task has an assignee
    IF NEW.assigned_to IS NOT NULL AND 
       (OLD.assigned_to IS NULL OR OLD.assigned_to != NEW.assigned_to) THEN
        
        -- Get notification type id
        SELECT id INTO notification_type_id FROM notification_types WHERE name = 'Tarefa Atribuída';
        
        -- Create notification
        INSERT INTO notifications (
            notification_type_id,
            user_id,
            title,
            message,
            entity_type,
            entity_id
        ) VALUES (
            notification_type_id,
            NEW.assigned_to,
            'Nova tarefa atribuída',
            'Você recebeu uma nova tarefa: ' || NEW.title,
            'tasks',
            NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to notify next responsible when a workflow step is completed
CREATE OR REPLACE FUNCTION notify_workflow_completion()
RETURNS TRIGGER AS $$
DECLARE
    next_step_id UUID;
    next_step_responsible UUID;
    notification_type_id UUID;
    purchase_request_id UUID;
    request_number VARCHAR;
    current_step_order INTEGER;
    next_step_name VARCHAR;
BEGIN
    -- Only proceed if status changed to 'Concluído'
    IF NEW.status = 'Concluído' AND (OLD.status != 'Concluído' OR OLD.status IS NULL) THEN
        -- Get current step order and purchase request
        SELECT ws.order_sequence, rw.purchase_request_id 
        INTO current_step_order, purchase_request_id
        FROM request_workflows rw
        JOIN workflow_steps ws ON rw.workflow_step_id = ws.id
        WHERE rw.id = NEW.id;
        
        -- Get request number
        SELECT request_number INTO request_number
        FROM purchase_requests
        WHERE id = purchase_request_id;
        
        -- Find the next workflow step
        SELECT ws.id, ws.name
        INTO next_step_id, next_step_name
        FROM workflow_steps ws
        WHERE ws.order_sequence = current_step_order + 1
        ORDER BY ws.order_sequence
        LIMIT 1;
        
        -- If there is a next step
        IF next_step_id IS NOT NULL THEN
            -- Find the responsible for the next step (if already assigned)
            SELECT responsible_id INTO next_step_responsible
            FROM request_workflows
            WHERE purchase_request_id = purchase_request_id
            AND workflow_step_id = next_step_id;
            
            -- If there's a responsible set for the next step
            IF next_step_responsible IS NOT NULL THEN
                -- Get notification type
                SELECT id INTO notification_type_id 
                FROM notification_types 
                WHERE name = 'Etapa Concluída';
                
                -- Create notification
                INSERT INTO notifications (
                    notification_type_id,
                    user_id,
                    title,
                    message,
                    entity_type,
                    entity_id
                ) VALUES (
                    notification_type_id,
                    next_step_responsible,
                    'Etapa anterior concluída',
                    'A etapa anterior do pedido #' || request_number || ' foi concluída. É hora de iniciar a etapa: ' || next_step_name,
                    'purchase_requests',
                    purchase_request_id
                );
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for activity logging
DO $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'purchase_requests', 'request_items', 'request_workflows', 
            'tasks', 'attachments'
        )
    LOOP
        EXECUTE format('
            CREATE TRIGGER log_%I_activity
            AFTER INSERT OR UPDATE OR DELETE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION log_activity();
        ', table_name, table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for task assignment notifications
CREATE TRIGGER notify_task_assignment_trigger
AFTER INSERT OR UPDATE OF assigned_to ON tasks
FOR EACH ROW
EXECUTE FUNCTION notify_task_assignment();

-- Create trigger for workflow completion notifications
CREATE TRIGGER notify_workflow_completion_trigger
AFTER UPDATE OF status ON request_workflows
FOR EACH ROW
EXECUTE FUNCTION notify_workflow_completion();

-- Function to calculate total purchase request value
CREATE OR REPLACE FUNCTION update_purchase_request_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total estimated value
    UPDATE purchase_requests
    SET total_estimated_value = (
        SELECT COALESCE(SUM(total_value), 0)
        FROM request_items
        WHERE purchase_request_id = NEW.purchase_request_id
    )
    WHERE id = NEW.purchase_request_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating purchase request totals
CREATE TRIGGER update_purchase_request_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON request_items
FOR EACH ROW
EXECUTE FUNCTION update_purchase_request_total();

-- RLS Policies setup
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE secretariats ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (to be expanded based on specific business rules)
CREATE POLICY admin_all_access ON municipalities 
    USING (EXISTS (
        SELECT 1 FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = current_setting('app.current_user_id', true)::UUID
        AND r.name = 'Administrador'
    ));

CREATE POLICY user_municipality_access ON secretariats
    USING (EXISTS (
        SELECT 1 FROM user_secretariats us
        WHERE us.secretariat_id = secretariats.id
        AND us.user_id = current_setting('app.current_user_id', true)::UUID
    ));

-- Index for notifications to optimize real-time notifications
CREATE INDEX idx_unread_notifications ON notifications (user_id) 
WHERE is_read = false;

-- Remember to grant appropriate permissions based on your application's security model
