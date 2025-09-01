import {useEffect,useMemo,useState} from "react";

interface PaymentM {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}