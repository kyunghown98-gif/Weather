import { configureStore } from "@reduxjs/toolkit";
import reducer from "./slice"

const store = configureStore({
  reducer:{weather:reducer}
})

export default store