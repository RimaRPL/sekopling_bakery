import Express from "express"
import CakesRoute from "./ROUTER/cakesRouter"
import MaterialsRoute from "./ROUTER/materialsRouter"
import SupplierRoute from "./ROUTER/suppliersRouter"
import UserRoute from "./ROUTER/userRouter"
import CompositionsRoute from "./ROUTER/compositionsRouter"
import SuppliesRoute from "./ROUTER/suppliesRouter"
import OrdersRoute from "./ROUTER/ordersRouter"


const app = Express()

app.use(Express.json())

app.use(`/Cakes`, CakesRoute)
app.use(`/Materials`, MaterialsRoute)
app.use(`/Suppliers`, SupplierRoute)
app.use(`/User`, UserRoute)
app.use(`/Compositions`, CompositionsRoute)
app.use(`/Supplies`, SuppliesRoute)
app.use(`/Orders`, OrdersRoute)

const PORT = 2000
app.listen(PORT, () => { 
    console.log(`Server Sekopling Bakery run on port ${PORT}`)
})