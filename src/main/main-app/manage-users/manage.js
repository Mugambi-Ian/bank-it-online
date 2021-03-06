import React, { Component } from "react";
import Loader from "../../../assets/components/loader/loader";
import { _database } from "../../../config";
import "./manage.css";

export default class ManageUsers extends Component {
  state = {
    accounts: [],
    searchKey: "",
    editing: undefined,
    userInfo: false,
    loading: true,
    myTransactions: undefined,
    customerId: undefined,
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
        <h3 className="title unselectable">Accounts</h3>
        <div className="search-bar" />
        {this.state.loading === true ? (
          <Loader />
        ) : this.state.myTransactions &&
          this.state.editing === undefined &&
          this.state.transact === undefined ? (
          <MyTransactions customerId={this.state.customerId} />
        ) : (
          <div className="accounts-list">
            {this.state.accounts.map((x, i) => {
              return (
                <div className="account-card">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
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
                    <p className="date unselectable">
                      Account Balance: {parseInt(x.customerBalance) + 0}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
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
                                editing: undefined,
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
                                editing: undefined,
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
                            this.setState({ editing: x, transact: undefined });
                          }, 100);
                        }}
                      >
                        Edit Account
                      </p>
                      <p
                        className="unselectable"
                        onClick={async () => {
                          await setTimeout(() => {
                            this.setState({
                              myTransactions: true,
                              customerId: x.customerId,
                              editing: undefined,
                              transact: undefined,
                            });
                          }, 100);
                        }}
                      >
                        View Transactions
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {this.state.editing && this.state.transact === undefined ? (
          <EditCustomer
            editing={this.state.editing}
            close={() => {
              this.setState({ editing: undefined,transact:undefined });
            }}
            showTimedToast={this.props.showTimedToast}
          />
        ) : (
          <p
            className="create-customer-btn unselectable"
            onClick={async () => {
              await setTimeout(() => {
                if (this.state.myTransactions) {
                  this.setState({ myTransactions: undefined });
                } else this.setState({ editing: { customerId: undefined } });
              }, 100);
            }}
          >
            {this.state.myTransactions ? "Close" : "New Customer"}
          </p>
        )}
        {this.state.transact && this.state.editing === undefined ? (
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
        customerBalance: "",
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
          customerBalance,
        } = data.val();
        const p = {
          customerId: customerId,
          customerName: customerName,
          customerStatus: customerStatus,
          phoneNumber: phoneNumber,
          address: address,
          createdOn: createdOn,
          customerBalance: customerBalance,
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
                var {
                  customerId,
                  customerName,
                  customerStatus,
                  createdOn,
                  phoneNumber,
                  address,
                  customerBalance,
                } = this.state.customer;
                if (customerBalance === undefined) customerBalance = 0;
                const p = {
                  customerId: customerId,
                  customerName: customerName,
                  customerStatus: customerStatus,
                  phoneNumber: phoneNumber,
                  address: address,
                  createdOn: createdOn,
                  customerBalance: customerBalance,
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

class MyTransactions extends Component {
  state = { transactions: [], loading: true };
  async componentDidMount() {
    await _database
      .ref("transactions/" + this.props.customerId)
      .on("value", (x) => {
        const dat = [];
        x.forEach((d) => {
          const _dat = [];
          d.forEach((x) => {
            _dat.push(x.val());
          });
          const _ = {
            d: d.key,
            data: _dat,
          };
          dat.push(_);
        });
        this.setState({ transactions: dat, loading: false });
      });
  }
  render() {
    return this.state.loading === true ? (
      <Loader />
    ) : (
      <div className="my-transactions">
        {this.state.transactions.map((x, i) => {
          return (
            <div className="date-card">
              <p className="date unselectable">{x.d}</p>
              {x.data.map((z, i) => {
                return (
                  <p className="msg unselectable">
                    {z.transactionType} of amount {z.transactionAmount}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
