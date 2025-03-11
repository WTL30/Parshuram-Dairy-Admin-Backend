const Order = require("../models/Order");

// const veiwOrders = async (req, res) => {
//     try {
//         const Orders = await Order.find()
//             .populate("items.productId") // Populate the productId inside the items array
//             .populate("userId"); // Optionally populate user details

//         if (!Orders) {
//             res.status(400).json({ message: "No Orders Found " })
//         }
//         res.status(200).json({
//             success: true,
//             message: "Orders fetched successfully",
//             data: Orders, // Sending the populated orders in response
//         });

//     } catch (error) {
//         res.status(400).json({ error: error.msg, message: "Error occur" })
//     }
// }

const veiwOrders = async (req, res) => {
  try {
      const orders = await Order.find()
          .populate("items.productId") // ✅ Fetch product details
          .populate("userId") // ✅ Fetch user details
          .exec();

      if (!orders.length) {
          return res.status(404).json({ success: false, message: "No Orders Found" });
      }

      res.status(200).json({
          success: true,
          message: "Orders fetched successfully",
          data: orders,
      });

  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


const updateOrders = async (req, res) => {
    try {

        const { orderId } = req.params; // Get order ID & item ID from request URL
        const updateData = req.body; // Get update data from request body
        
        // Update only the specific item in the order
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId }, // Find the order that contains the item
            { $set: updateData }
            // { $set: { "items.$": updateData } }, // Update only the matched item
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order or item not found" });
        }

        res.json({
            success: true,
            message: "Order item updated successfully",
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating order item", error: error.message });
    }

}

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params; // Get order ID from request URL

        // Find and delete the order
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({
            success: true,
            message: "Order deleted successfully",
            data: deletedOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting order",
            error: error.message,
        });
    }
};

const updateStatus = async (req,res) => {
    try {
        const { orderId } = req.params; // Get Order ID from URL
        const { status } = req.body; // Get new status from request body
    
        // Validate status (Optional)
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled","Confirmed"];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ success: false, message: "Invalid status value" });
        }
    
        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { status }
        ).populate("userId", "name email"); // Populate customer details
    
        if (!updatedOrder) {
          return res.status(404).json({ success: false, message: "Order not found" });
        }
    
        res.json({
          success: true,
          message: "Order status updated successfully",
          data: updatedOrder,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Error updating order status",
          error: error.message,
        });
      }
} 

const cancelOrder  = async (req,res) =>{
    try {
        const { orderId } = req.params; // Get Order ID from URL
    
        // Find the order
        const order = await Order.findById(orderId);
    
        if (!order) {
          return res.status(404).json({ success: false, message: "Order not found" });
        }
    
        // Check if the order is already cancelled
        if (order.status === "Cancelled") {
          return res.status(400).json({ success: false, message: "Order is already cancelled" });
        }
    
        // Update order status to "Cancelled"
        order.status = "Cancelled";
        await order.save();
    
        res.json({
          success: true,
          message: "Order cancelled successfully",
          data: order,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Error cancelling order",
          error: error.message,
        });
      }
}

module.exports = { veiwOrders , updateOrders, updateStatus,cancelOrder, deleteOrder}