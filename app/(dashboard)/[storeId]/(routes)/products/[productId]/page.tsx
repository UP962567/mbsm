import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/products-form";


const ProductPage = async ({
  params
}: {
  params: { productId: string, storeId: string; }
}) => {
  const billboard = await prismadb.product.findUnique({
    where: {
      uuid: params.productId
    },
    include: {
      images: true,
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const zcategories = await prismadb.zCategory.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const tags = await prismadb.tag.findMany({
    where: {
      storeId: params.storeId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
        initialData={billboard} 
        categories={categories}
        sizes={sizes}
        colors={colors}
        zcategories={zcategories}
        />
      </div>
    </div>
  );
}

export default ProductPage;