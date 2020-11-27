import React, { Component } from "react";
import Loader from "../../../assets/components/loader/loader";
import { _database } from "../../../config";
import "./manage.css";

export default class ManageUsers extends Component {
  state = {
    accounts: [],
    searchKey: "",
    editing: false,
    userInfo: false,
    loading: true,
  };
  async componentDidMount() {
    await _database.ref("customers").on("value", (x) => {
      const d = [];
      x.forEach((c) => {
        const _c = c.val();
        d.push(_c);
      });
      this.setState({ accounts: d, loading: false });
    });
  }
  render() {
    return (
      <div className="manage-body">
        <h3 className="title unselectable">Customer Accounts</h3>
        <div className="search-bar"></div>
        {this.state.loading === true ? (
          <Loader />
        ) : (
          <div className="accounts-list">
            {this.state.accounts.map((x, i) => {
              return (
                <div className="account-card">
                  <img
                    alt=""
                    src={
                      require("../../../assets/drawables/account.png").default
                    }
                    className="unselectable"
                  />
                  <p className="name unselectable">{x.customerName}</p>
                  <p className="status unselectable">
                    {x.customerStatus === true ? "active" : "Deactivated"}
                  </p>
                  <p className="date unselectable">
                    Registered on: {x.createdOn}
                  </p>
                  <div className="card-options">
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await setTimeout(() => {
                          if (x.customerStatus === true) {
                            this.setState({
                              transact: {
                                customerId: x.customerId,
                                transactionAmount: "",
                                transactionType: "Withdraw",
                                date: "",
                              },
                            });
                          } else {
                            this.props.showTimedToast(
                              x.customerName + " is deactivated"
                            );
                          }
                        }, 100);
                      }}
                    >
                      Withdraw
                    </p>
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await setTimeout(() => {
                          if (x.customerStatus === true) {
                            this.setState({
                              transact: {
                                customerId: x.customerId,
                                transactionAmount: "",
                                transactionType: "Deposit",
                                date: "",
                              },
                            });
                          } else {
                            this.props.showTimedToast(
                              x.customerName + " is deactivated"
                            );
                          }
                        }, 100);
                      }}
                    >
                      Deposit
                    </p>
                  </div>
                  <div className="card-options">
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await setTimeout(() => {
                          this.setState({ editing: x });
                        }, 100);
                      }}
                    >
                      Edit Account
                    </p>
                    <p className="unselectable">View Transactions</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {this.state.editing ? (
          <EditCustomer
            editing={this.state.editing}
            close={() => {
              this.setState({ editing: undefined });
            }}
            showTimedToast={this.props.showTimedToast}
          />
        ) : (
          <p
            className="create-customer-btn unselectable"
            onClick={async () => {
              await setTimeout(() => {
                this.setState({ editing: { customerId: undefined } });
              }, 100);
            }}
          >
            New Customer
          </p>
        )}
        {this.state.transact ? (
          <Transact
            transact={this.state.transact}
            close={() => {
              this.setState({ transact: undefined });
            }}
            showTimedToast={this.props.showTimedToast}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

class EditCustomer extends Component {
  state = {
    loading: true,
    customer: {
      customerId: "",
      customerName: "",
      customerStatus: true,
      createdOn: "",
    },
    exit: false,
    registered: false,
  };
  async componentDidMount() {
    var x = this.props.editing;
    if (x === undefined || x.customerId === undefined) {
      x = {
        customerId: "",
        customerName: "",
        customerStatus: "",
        createdOn: "",
      };
      const k = await _database.ref("pipelines").push();
      x.customerId = k.key;
      const _d = new Date();
      const d =
        _d.getFullYear() + "-" + (_d.getMonth() + 1) + "-" + _d.getDate();
      x.createdOn = d;
    } else {
      this.setState({ registered: true });
    }
    await _database.ref("customers/" + x.customerId).on("value", (data) => {
      if (data.val()) {
        const {
          customerId,
          customerName,
          customerStatus,
          createdOn,
          phoneNumber,
          address,
        } = data.val();
        const p = {
          customerId: customerId,
          customerName: customerName,
          customerStatus: customerStatus,
          phoneNumber: phoneNumber,
          address: address,
          createdOn: createdOn,
        };
        this.setState({ customer: p });
      } else {
        const p = {
          customerId: x.customerId,
          customerName: "",
          customerStatus: true,
          phoneNumber: "",
          address: "",
          createdOn: x.createdOn,
        };
        this.setState({ customer: p });
      }
      this.setState({
        loading: false,
      });
    });
  }
  render() {
    return (
      <div
        className={
          this.state.exit === false
            ? "edit-customer-body start"
            : "edit-customer-body exit"
        }
      >
        {this.state.loading === true ? (
          <Loader />
        ) : (
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              minHeight: "100%",
              animation: "fade-in ease-in 0.3s",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1",
                minHeight: "80%",
              }}
            >
              <p
                className="btn close unselectable"
                onClick={async () => {
                  await setTimeout(() => {
                    this.setState({ exit: true });
                    this.props.close();
                  }, 100);
                }}
              >
                Close
              </p>
              <h3 className="customer-title unselectable">
                {this.state.customer.customerName
                  ? this.state.customer.customerName
                  : "Create new customer"}
              </h3>
              <div className="field">
                <img
                  alt=""
                  draggable={false}
                  src={
                    require("../../../assets/drawables/calendar.png").default
                  }
                  className="unselectable"
                />
                <p className="field-title">Registered On</p>
                <input disabled={true} value={this.state.customer.createdOn} />
              </div>
              <div className="field">
                <img
                  alt=""
                  draggable={false}
                  src={require("../../../assets/drawables/id.png").default}
                  className="unselectable"
                />
                <p className="field-title">Customer Id</p>
                <input value={this.state.customer.customerId} disabled={true} />
              </div>
              <div className="field">
                <img
                  alt=""
                  draggable={false}
                  src={require("../../../assets/drawables/name.png").default}
                  className="unselectable"
                />
                <p className="field-title">Customer Name</p>
                <input
                  value={this.state.customer.customerName}
                  onChange={(_) => {
                    const x = this.state.customer;
                    x.customerName = _.target.value;
                    this.setState({ customer: x });
                  }}
                  placeholder="Customer Name"
                  name="customerName"
                />
              </div>
              <div className="field">
                <img
                  alt=""
                  draggable={false}
                  src={require("../../../assets/drawables/address.png").default}
                  className="unselectable"
                />
                <p className="field-title">Address</p>
                <input
                  value={this.state.customer.address}
                  onChange={(_) => {
                    const x = this.state.customer;
                    x.address = _.target.value;
                    this.setState({ customer: x });
                  }}
                  placeholder="Address"
                  name="address"
                />
              </div>
              <div className="field">
                <img
                  alt=""
                  draggable={false}
                  src={require("../../../assets/drawables/phone.png").default}
                  className="unselectable"
                />
                <p className="field-title">Phone-Number</p>
                <input
                  value={this.state.customer.phoneNumber}
                  onChange={(_) => {
                    const x = this.state.customer;
                    x.phoneNumber = _.target.value;
                    this.setState({ customer: x });
                  }}
                  placeholder="Phone Number"
                  name="customerPhone"
                />
              </div>
              <h3 className="customer-sub-title unselectable">
                Customer Status
              </h3>
              <div className="status-options">
                <p
                  className={
                    this.state.customer.customerStatus === true
                      ? "select unselectable"
                      : "unselectable"
                  }
                  onClick={async () => {
                    await setTimeout(() => {
                      if (this.state.registered === true) {
                        const x = this.state.customer;
                        x.customerStatus = true;
                        this.setState({ customer: x });
                      }
                    }, 100);
                  }}
                >
                  Active
                </p>
                <p
                  className={
                    this.state.customer.customerStatus !== true
                      ? "select unselectable"
                      : "unselectable"
                  }
                  onClick={async () => {
                    await setTimeout(() => {
                      if (this.state.registered === true) {
                        const x = this.state.customer;
                        x.customerStatus = false;
                        this.setState({ customer: x });
                      }
                    }, 100);
                  }}
                >
                  Disconnected
                </p>
              </div>
            </div>
            <p
              className="btn unselectable"
              onClick={async () => {
                const {
                  customerId,
                  customerName,
                  customerStatus,
                  createdOn,
                  phoneNumber,
                  address,
                } = this.state.customer;
                const p = {
                  customerId: customerId,
                  customerName: customerName,
                  customerStatus: customerStatus,
                  phoneNumber: phoneNumber,
                  address: address,
                  createdOn: createdOn,
                };

                await _database
                  .ref("customers/" + p.customerId)
                  .set(p)
                  .then((c) => {
                    this.props.showTimedToast("Save Succeffull");
                    this.props.close();
                  });
              }}
            >
              Save
            </p>
            <div style={{ marginTop: "10px" }} />
          </div>
        )}
      </div>
    );
  }
}
class Transact extends Component {
  state = {
    customerId: "",
    transactionAmount: "",
    transactionType: "",
    date: "",
  };
  async componentDidMount() {
    var x = this.props.transact;
    const _d = new Date();
    const d = _d.getFullYear() + "-" + (_d.getMonth() + 1) + "-" + _d.getDate();
    x.date = d;
    this.setState({
      customerId: x.customerId,
      transactionAmount: x.transactionAmount,
      transactionType: x.transactionType,
      date: d,
      transactionId: "",
    });
  }
  render() {
    return (
      <div
        className={
          this.state.exit === false
            ? "transact-body start"
            : "transact-body exit"
        }
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            minHeight: "100%",
            animation: "fade-in ease-in 0.3s",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1",
              minHeight: "80%",
            }}
          >
            <p
              className="btn close unselectable"
              onClick={async () => {
                await setTimeout(() => {
                  this.setState({ exit: true });
                  this.props.close();
                }, 100);
              }}
            >
              Close
            </p>
            <h3 className="customer-title unselectable">
              {this.state.transactionType}
            </h3>
            <div className="field">
              <img
                alt=""
                draggable={false}
                src={require("../../../assets/drawables/calendar.png").default}
                className="unselectable"
              />
              <p className="field-title">Transaction Date</p>
              <input disabled={true} value={this.state.date} />
            </div>
            <div className="field">
              <img
                alt=""
                draggable={false}
                src={require("../../../assets/drawables/send.png").default}
                className="unselectable"
              />
              <p className="field-title">Amount</p>
              <input
                value={this.state.transactionAmount}
                onChange={(_) => {
                  this.setState({
                    transactionAmount: parseInt("0" + _.target.value),
                  });
                }}
                placeholder="Amount"
                name="Amount"
              />
            </div>
          </div>
          <p
            className="btn unselectable"
            onClick={async () => {
              const {
                customerId,
                transactionAmount,
                transactionType,
                date,
              } = this.state;
              const p = {
                customerId: customerId,
                transactionAmount: transactionAmount,
                transactionType: transactionType,
                date: date,
              };
              if (p.transactionType === "Deposit") {
                await _database
                  .ref("transactions/" + p.customerId + "/" + date)
                  .push(p)

                  .then(async (c) => {
                    await _database
                      .ref("customers/" + p.customerId + "/customerBalance")
                      .once("value", async (c) => {
                        var amount = p.transactionAmount;
                        if (c.val()) {
                          amount = amount + parseInt(c.val());
                        }
                        c.ref.set(amount);
                        this.props.close();
                        this.props.showTimedToast("Deposit Succesfull");
                      });
                  });
              } else {
                await _database
                  .ref("customers/" + p.customerId + "/customerBalance")
                  .once("value", async (c) => {
                    var amount = p.transactionAmount;
                    if (c.val() && amount <= parseInt(c.val())) {
                      await _database
                        .ref("transactions/" + p.customerId + "/" + date)
                        .push(p)
                        .then(async (c) => {
                          await _database
                            .ref(
                              "customers/" + p.customerId + "/customerBalance"
                            )
                            .once("value", async (c) => {
                              var amount = p.transactionAmount;
                              if (c.val()) {
                                amount = parseInt(c.val()) - amount;
                              }
                              c.ref.set(amount);
                              this.props.close();
                              this.props.showTimedToast(
                                "Withdrawall Succesfull"
                              );
                            });
                        });
                    } else {
                      this.props.showTimedToast("Insufficient Funds");
                    }
                  });
              }
            }}
          >
            {this.state.transactionType}
          </p>
          <div style={{ marginTop: "10px" }} />
        </div>
      </div>
    );
  }
}
