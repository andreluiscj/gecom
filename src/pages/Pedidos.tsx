import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PedidosTable from "@/components/Pedidos/PedidosTable";
import { obterTodosPedidos } from "@/data/mockData";
import { PedidoCompra } from "@/types";
import { Plus } from "lucide-react";

const Pedidos: React.FC = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<PedidoCompra[]>(obterTodosPedidos());

  const handleNewPedidoClick = () => {
    navigate("/pedidos/novo");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos de Compra</h1>
          <p className="text-muted-foreground">
            Gerencie todos os pedidos de compra do município
          </p>
        </div>
        <Button onClick={handleNewPedidoClick}>
          <Plus className="mr-2 h-4 w-4" /> Novo Pedido
        </Button>
      </div>

      <PedidosTable pedidos={pedidos} />
    </div>
  );
};

export default Pedidos;
