"use client"

import { Button, Group, Modal, NumberInput, Radio } from "@mantine/core";
import { DateTimePicker } from '@mantine/dates';
import { DateTime } from "luxon";
import CompanySelector from "../companies/CompanySelector";
import { useState } from "react";
import { TransactionForm, TransactionType } from "@/app/_types/transactions";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";
import _ from "lodash";
import { Company } from "@/app/_types/companies";
import { useTransactionStore } from "@/app/_store";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddTransactionModal(props: Props) {
  const toast = useToast();
  const increment = useTransactionStore((state) => state.increment);
  const initialState: TransactionForm = {
    company: null,
    quantity: 0,
    tax_amount: 0,
    price: 0,
    type: 'buy',
    transaction_timestamp: new Date(),
  };
  const [form, setForm] = useState<TransactionForm>({ ...initialState });

  async function handleSubmitTransactionForm() {
    const formData = _.omit(form, ["company", "transaction_timestamp"]);
    if (!form.company) {
      toast("error", "You must select a company first.");
      return;
    }

    await fetch(
      `${getCurrentDomain()}/api/transactions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          company_id: form.company.id,
          transaction_timestamp: DateTime.fromJSDate(form.transaction_timestamp)
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        toast("success", "New transaction created.");
        increment();
        props.onClose();
        setForm({ ...initialState });
      })
      .catch((e) => toast("error", (e as Error).message));
  }

  return (
    <>
      <Modal size="md" opened={props.open} onClose={() => props.onClose()} title="Add Transaction" centered>
        <DateTimePicker
          label="Transaction Datetime"
          placeholder="Enter date and time"
          value={form.transaction_timestamp}
          onChange={(val) => setForm({ ...form, transaction_timestamp: val as Date })}
        />
        <div style={{ padding: "0.5rem", display: "flex", flexDirection: "column", rowGap: "0.5rem" }}>
          <Radio.Group
            name="transactionType"
            label="Transaction Type"
            value={form.type}
            onChange={(type) => setForm({ ...form, type: type as TransactionType })}
            withAsterisk
          >
            <Group mt="xs">
              <Radio value="buy" label="Buy" />
              <Radio value="sell" label="Sell" />
            </Group>
          </Radio.Group>

          <div>
            <span style={{ fontWeight: 500, fontSize: "var(--input-label-size, var(--mantine-font-size-sm))" }}>
              Company
            </span>
            <CompanySelector
              onSelect={(company) => setForm({ ...form, company: company as Company })}
              addAllCompaniesOption={false}
            />
          </div>

          <NumberInput
            label="Price"
            fixedDecimalScale
            decimalScale={2}
            value={form.price}
            onChange={(value) => setForm({ ...form, price: Number(value) })}
          />

          <NumberInput
            label="Quantity"
            decimalScale={0}
            fixedDecimalScale
            value={form.quantity}
            onChange={(value) => setForm({ ...form, quantity: Number(value) })}
          />

          <NumberInput
            label="Total Taxes & Fees"
            fixedDecimalScale
            decimalScale={2}
            value={form.tax_amount}
            onChange={(value) => setForm({ ...form, tax_amount: Number(value) })}
          />

          <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "end", marginTop: "1rem" }}>
            <Button onClick={() => handleSubmitTransactionForm()}>Submit</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}