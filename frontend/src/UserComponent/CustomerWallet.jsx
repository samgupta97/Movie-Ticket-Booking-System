// import { useState, useEffect } from "react";
// import axios from "axios";
// import BASE_URL from "../api/api";

// const CustomerWallet = () => {

//   const user = JSON.parse(sessionStorage.getItem("active-customer"));

//   const [walletAmount, setWalletAmount] = useState(user.walletAmount);

//   const [walletRequest, setWalletRequest] = useState({
//     id: user.id,
//     walletAmount: "",
//     userId: user.id,
//   });

//   const handleInput = (e) => {
//     setWalletRequest({
//       ...walletRequest,
//       [e.target.name]: e.target.value,
//     });
//   };

//   /* ---------------- FETCH WALLET ---------------- */
//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/user/fetch/user-id?userId=${user.id}`)
//       .then((response) => {
//         if (response.data && response.data.users.length > 0) {
//           setWalletAmount(response.data.users[0].walletAmount);
//         }
//       })
//       .catch(() => {
//         alert("Server error while fetching wallet");
//       });
//   }, []);

//   /* ---------------- LOAD RAZORPAY SCRIPT ---------------- */
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   /* ---------------- ADD MONEY ---------------- */
//   const addMoneyInWallet = (e) => {
//     e.preventDefault();

//     // request body
//     // {
//     //  "id": 2,
//     //  "walletAmount": "500"
//     // }

//     // reponse body
//     // {
//     //   "success": true,
//     //   "razorPayRequest": {
//     //     "orderId": "order_ABC123",
//     //     "amount": 50000,
//     //     "key": "rzp_test_xxx"
//     //   }
//     // }


//     axios
//       .put(`${BASE_URL}/user/update/wallet`, walletRequest)

//       .then((result) => {
//         const res = result.data;

//         if (!res.success) {
//           alert(res.responseMessage);
//           window.location.reload();
//           return;
//         }

//         let options = res.razorPayRequest;

//         options.handler = function (response) {
//           response.razorpay_order_id = options.orderId;

//           // iska response body
//           //{
//           //   "razorpay_payment_id": "pay_123",
//           //   "razorpay_order_id": "order_ABC123"
//           // }

//           // jo ki agali api ki reuest body mai bhej rahe hai 
//           axios
//             .put(`${BASE_URL}/user/razorpPay/response`, response)
//             .then((r) => {
//               if (r.data.success) {
//                 alert(r.data.responseMessage); //
//                 // aur ye response mai ye aaa rha hai
//                 //                 {
//                 //   "success": true,
//                 //   "responseMessage": "User Wallet Updated Successful"
//                 // }

//               } else {
//                 alert(r.data.responseMessage);
//               }
//               window.location.reload();
//             })
//             .catch(() => {
//               alert("Server error");
//               window.location.reload();
//             });
//         };

//         if (window.Razorpay) {
//           const rzp1 = new window.Razorpay(options);

//           rzp1.on("payment.failed", function (response) {
//             response.razorpay_order_id = options.orderId;

//             axios
//               .put(`${BASE_URL}/user/razorpPay/response`, response)
//               .then((r) => {
//                 alert(r.data.responseMessage);
//                 window.location.reload();
//               })
//               .catch(() => {
//                 alert("Server error");
//                 window.location.reload();
//               });
//           });

//           rzp1.open();
//         } else {
//           alert("Payment Gateway error");
//           window.location.reload();
//         }
//       })
//       .catch(() => {
//         alert("Server error");
//         window.location.reload();
//       });
//   };

//   return (
//     <div>
//       <div className="mt-2 mb-4 d-flex aligns-items-center justify-content-center">
//         <div className="card form-card" style={{ width: "25rem" }}>
//           <div
//             className="card-header bg-color text-center custom-bg-text mb-3"
//             style={{ borderRadius: "1em", height: "45px" }}
//           >
//             <h4>My Wallet</h4>
//           </div>

//           <h4 className="text-center mt-3 mb-4">
//             Wallet Balance: ₹ {walletAmount}
//           </h4>

//           <hr />

//           <div
//             className="card-header bg-color text-center custom-bg-text"
//             style={{ borderRadius: "1em", height: "45px" }}
//           >
//             <h5>Add Money In Wallet</h5>
//           </div>

//           <div className="card-body">
//             <form>
//               <div className="mb-3">
//                 <label className="form-label">
//                   <b>Amount</b>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="walletAmount"
//                   value={walletRequest.walletAmount}
//                   onChange={handleInput}
//                   required
//                 />
//               </div>

//               <div className="d-flex justify-content-center">
//                 <button
//                   type="submit"
//                   className="btn bg-color custom-bg-text"
//                   onClick={addMoneyInWallet}
//                 >
//                   Update Wallet
//                 </button>
//               </div>
//             </form>
//           </div>


//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerWallet;


import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../api/api";

const CustomerWallet = () => {
  const user = JSON.parse(sessionStorage.getItem("active-customer"));

  const [walletAmount, setWalletAmount] = useState(user.walletAmount);

  const [walletRequest, setWalletRequest] = useState({
    id: user.id,
    walletAmount: "",
    userId: user.id,
  });

  const handleInput = (e) => {
    setWalletRequest({
      ...walletRequest,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- FETCH WALLET ---------------- */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/fetch/user-id?userId=${user.id}`)
      .then((response) => {
        if (response.data && response.data.users.length > 0) {
          setWalletAmount(response.data.users[0].walletAmount);
        }
      })
      .catch(() => {
        alert("Server error while fetching wallet");
      });
  }, []);

  /* ---------------- LOAD RAZORPAY SCRIPT ---------------- */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /* ---------------- ADD MONEY ---------------- */
  const addMoneyInWallet = (e) => {
    e.preventDefault();

    /*
      Request Body:
      {
        "id": 2,
        "walletAmount": "500"
      }

      Response Body:
      {
        "success": true,
        "razorPayRequest": {
          "orderId": "order_ABC123",
          "amount": 50000,
          "key": "rzp_test_xxx"
        }
      }
    */

    axios
      .put(`${BASE_URL}/user/update/wallet`, walletRequest)
      .then((result) => {
        const res = result.data;

        if (!res.success) {
          alert(res.responseMessage);
          window.location.reload();
          return;
        }

        let options = res.razorPayRequest;

        options.handler = function (paymentData) {
          paymentData.razorpay_order_id = options.orderId;

          /*
            Razorpay Success Response:
            {
              "razorpay_payment_id": "pay_123",
              "razorpay_order_id": "order_ABC123"
            }
          */

          axios
            .put(`${BASE_URL}/user/razorpPay/response`, paymentData)
            .then((r) => {
              alert(r.data.responseMessage);
              /*
                Response:
                {
                  "success": true,
                  "responseMessage": "User Wallet Updated Successful"
                }
              */
              window.location.reload();
            })
            .catch(() => {
              alert("Server error");
              window.location.reload();
            });
        };

        if (window.Razorpay) {
          const rzp1 = new window.Razorpay(options);

          rzp1.on("payment.failed", function (paymentData) {
            paymentData.razorpay_order_id = options.orderId;

            axios
              .put(`${BASE_URL}/user/razorpPay/response`, paymentData)
              .then((r) => {
                alert(r.data.responseMessage);
                window.location.reload();
              })
              .catch(() => {
                alert("Server error");
                window.location.reload();
              });
          });

          rzp1.open();
        } else {
          alert("Payment Gateway error");
          window.location.reload();
        }
      })
      .catch(() => {
        alert("Server error");
        window.location.reload();
      });
  };

  return (
    <div>
      <div className="mt-2 mb-4 d-flex aligns-items-center justify-content-center">
        <div className="card form-card" style={{ width: "25rem" }}>
          <div
            className="card-header bg-color text-center custom-bg-text mb-3"
            style={{ borderRadius: "1em", height: "45px" }}
          >
            <h4>My Wallet</h4>
          </div>

          <h4 className="text-center mt-3 mb-4">
            Wallet Balance: ₹ {walletAmount}
          </h4>

          <hr />

          <div
            className="card-header bg-color text-center custom-bg-text"
            style={{ borderRadius: "1em", height: "45px" }}
          >
            <h5>Add Money In Wallet</h5>
          </div>

          <div className="card-body">
            <form>
              <div className="mb-3">
                <label className="form-label">
                  <b>Amount</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="walletAmount"
                  value={walletRequest.walletAmount}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn bg-color custom-bg-text"
                  onClick={addMoneyInWallet}
                >
                  Update Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerWallet;
