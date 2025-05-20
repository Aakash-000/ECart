import ProductForm from "@/components/product-form";
import React from "react";

const AddProductPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  );
};

export default AddProductPage;