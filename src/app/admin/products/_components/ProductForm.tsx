"use client";

import { useActionState, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { formatCurrency } from "../../../../lib/formatters";
import { Textarea } from "../../../../components/ui/textarea";
import { Button } from "../../../../components/ui/button";
import { addProduct } from "../../_actions/products";
import {   useFormStatus } from "react-dom";

export function ProductForm() {
    const [error, action] = useActionState(addProduct, {})
    const [priceInCents, setPriceInCents] = useState<number>(0)
  //   const [formData, setFormData] = useState({
  //     name: '',
  //     description: '',
  //     priceInCents: 0,
  //     file: null,
  //     image: null,
  // });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
// };

// const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = e.target;
//     if (files && files.length > 0) {
//         setFormData(prev => ({ ...prev, [name]: files[0] }));
//     }
// };

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
        //   onChange={e => {
        //     const value = Number(e.target.value) || 0;
        //     setPriceInCents(value);
        //     setFormData(prev => ({ ...prev, priceInCents: value }));
        // }}
          onChange={e => setPriceInCents(Number(e.target.value) || 0)}
        />
        <div className="text-muted-foreground"><Label>{formatCurrency((priceInCents || 0
        ) / 100)}</Label></div>
        {error.priceInCents && <div className="text-destructive">{error.priceInCents}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required/>
        {error.description && <div className="text-destructive">{error.description}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required />
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required />
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
    const {pending} = useFormStatus()
    return <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
}


