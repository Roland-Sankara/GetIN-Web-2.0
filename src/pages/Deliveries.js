/*
# To do
- Separate the services for home and health facility births
- Filters and remote pagiantions and search

*/
import React, { Component } from "react";
import { NavDropdown, MenuItem } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaby } from "@fortawesome/free-solid-svg-icons";
import { Tabs, Tab } from "react-bootstrap";
import moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
const service = require("../api/services");

let order = "desc";
let startOFDay = new Date();
startOFDay.setHours(0, 0, 0, 0);

let prevMonthFirstDay = moment()
  .subtract(1, "months")
  .date(1)
  .local()
  .format("YYYY-MM-DD");

var endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

export default class Deliveries extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      key: "health_facility"
    };
  }
  componentDidMount() {}
  render() {
    return (
      <React.Fragment>
        <div className="col-md-12">
          <div className="col-md-12 title">
            <h4 className="pull-left">
              {" "}
              <span>
                <FontAwesomeIcon icon={faBaby} />
              </span>{" "}
              Deliveries
            </h4>
            <br className="clear-both" />
            <br className="clear-both" />
          </div>
          <div className="col-md-12 bg-white-content">
            <Tabs
              id="controlled-tab-example"
              activeKey={this.state.key}
              onSelect={key => this.setState({ key })}
            >
              <Tab eventKey="health_facility" title="Health Facility Births">
                <HealthFacility />
              </Tab>
              <Tab eventKey="home" title="Home births">
              <Home />
              </Tab>
             
            </Tabs>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class HealthFacility extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        deliveries: [],
        deliveries_copy: [],
        isLoaded: false,
        loadingText: "Loading ..",
        status: "All",
        from: prevMonthFirstDay,
        to: moment(endOfDay)
          .local()
          .format("YYYY-MM-DD"),
        showCoords: true,
        manageColomns: {
          name: false,
          village: false,
          sub_county: true,
          next_of_kin: true,
          dob: true,
          marital_status:true,
  
          // deliveries data
          followup_reason: true,
          action_taken: true,
          received_postnatal_care: true,
          delivery:false,
          family_planning:false,
          delivery_date: false,
          health_facility: false
        },
        // remote pagination
        currentPage: 1,
        sizePerPage: 20,
        totalDataSize: 0
      };
      this.getData = this.getData.bind(this);
    }
    componentDidMount() {
      this.getData();
    }
    getData() {
      const thisApp = this;
      thisApp.setState({
        deliveries: [],
        deliveries_copy: [],
        loadingText: "Loading..."
      });
      service.deliveries(function(error, response) {
        console.log(response);
        if (error) {
          console.log(error);
          thisApp.setState(
            {
              isLoaded: true,
              deliveries: []
            },
            () => console.log(thisApp.state)
          );
        } else {
          thisApp.setState(
            {
              isLoaded: true,
              deliveries: response.results
            },
            () => console.log(thisApp.state)
          );
        }
      });
    }
    nameFormatter(cell, row) {
      return (
        row.girl.first_name +
        " " +
        row.girl.last_name +
        " - " +
        row.girl.phone_number
      );
    }
  
    trimesterFormatter(cell, row) {
      return row.girl.trimester;
    }
    nextOfKinFormatter(cell, row) {
      return (
        row.girl.next_of_kin_name + " - " + row.girl.next_of_kin_phone_number
      );
    }
    getVillageItem(cell, row, item) {
      return row.girl.village[item];
    }
    getGirlItem(cell, row, item) {
      return row.girl[item];
    }
    getSubcountyItem(cell, row, item) {
      return row.girl.village.parish.sub_county[item];
    }
    updateTable(colomn) {
      //make a copy of state
      let manageColomns = this.state.manageColomns;
  
      if (this.state.manageColomns[colomn] === true) {
        manageColomns[colomn] = false;
        this.setState({
          manageColomns: manageColomns
        });
      } else {
        manageColomns[colomn] = true;
        this.setState({
          manageColomns: manageColomns
        });
      }
    }
    ageFormatter(cell, row) {
      return moment().diff(row.girl.dob, "years");
    }
    dateFormatter(cell) {
      console.log(cell);
      return moment(new Date(cell)).format("Do MMM YY hh a");
    }
    deliveryFormatter(cell, row) {
     // console.log(cell);
     let delivery = "";
      if(row.is_mother_alive && row.is_baby_alive){
          return delivery = "Mother Alive, Baby Alive";
      }
      else if(!row.is_mother_alive && row.is_baby_alive){
          return delivery = "Mother Dead, Baby Alive";
      }
      else if(row.is_mother_alive && !row.is_baby_alive){
          return delivery = "Mother Alive, Baby Still";
      }
      else if(row.is_mother_alive && !row.is_baby_alive){
          return delivery = "Mother Dead, Baby Still";
      }else{
          return delivery = "Not recorded";
      }
    }
    familyPlanningFormatter(cell, row) {
      // console.log(cell);
      let familyPlanning = "";
       if(row.using_family_planning){
           return familyPlanning = "Yes, "+row.family_planning_type;
       }
      else{
           return familyPlanning = "None, "+row.no_family_planning_reason;
       }
     }
    enumFormatter(cell, row, enumObject) {
      return enumObject[cell];
    }
  
    render() {
      let deliveries = this.state.deliveries;
      const YesNoFormat = {
        true: "Yes",
        false: "No"
      };
      const options = {
        page: this.state.currentPage, // which page you want to show as default
        onPageChange: this.onPageChange,
        onSortChange: this.onSortChange,
        onFilterChange: this.onFilterChange,
        //   sizePerPageList: xxx, // you can change the dropdown list for size per page
        sizePerPage: parseInt(this.state.sizePerPage), // which size per page you want to locate as default
        pageStartIndex: 1, // where to start counting the pages
        paginationSize: 10,
        prePage: "Prev", // Previous page button text
        nextPage: "Next", // Next page button text
        firstPage: "First", // First page button text
        paginationPosition: "bottom" // default is bottom, top and both is all available
      };
      return (
        <div className="col-md-12 bg-white-content">
          <form className="form-inline pull-right">
            <div className="form-group">
              <label htmlFor="email">From:</label>
              <input
                name="from"
                value={this.state.from}
                onChange={this.handleInputChange}
                className="form-control"
                type="date"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">To:</label>
              <input
                name="to"
                value={this.state.to}
                onChange={this.handleInputChange}
                className="form-control"
                type="date"
              />
            </div>
            <NavDropdown
              eventKey={3}
              className="pull-right"
              title="Manage columns"
              id="basic-nav-dropdown"
            >
              <MenuItem
                onClick={(e, name) => this.updateTable("name")}
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.name} /> Mother
              </MenuItem>
              <MenuItem
                onClick={(e, village) => this.updateTable("village")}
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.village} /> Village
              </MenuItem>
              {/* <MenuItem onClick={(e, sub_county) => this.updateTable("sub_county")} eventKey={3.1}> <Check state={this.state.manageColomns.sub_county} /> Sub County</MenuItem>         */}
              <MenuItem
                onClick={(e, next_of_kin_name) => this.updateTable("next_of_kin")}
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.next_of_kin} /> Next of kin
              </MenuItem>
              <MenuItem
                onClick={(e, marital_status) =>
                  this.updateTable("marital_status")
                }
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.marital_status} /> Marital
                status
              </MenuItem>
               <MenuItem
                onClick={(e, followup_reason) =>
                  this.updateTable("followup_reason")
                }
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.followup_reason} />{" "}
                Follow up reason
              </MenuItem>
  
              <MenuItem
                onClick={(e, action_taken) =>
                  this.updateTable("action_taken")
                }
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.action_taken} />
                Action taken
              </MenuItem>
  
              <MenuItem
                onClick={(e, name) => this.updateTable("dob")}
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.dob} /> Age
              </MenuItem>
  
              <MenuItem
                onClick={(e, received_postnatal_care) => this.updateTable("received_postnatal_care")}
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.received_postnatal_care} /> Received postnatal care
              </MenuItem>
              <MenuItem
                onClick={(e, delivery) => this.updateTable("delivery")}
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.delivery} /> Delivery status
              </MenuItem>
              <MenuItem
                onClick={(e, family_planning) => this.updateTable("family_planning")}
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.family_planning} /> Family planning
              </MenuItem>
  
              <MenuItem
                onClick={(e, delivery_date) => this.updateTable("delivery_date")}
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.delivery_date} /> Date of delivery
              </MenuItem>
              <MenuItem
                onClick={(e, health_facility) => this.updateTable("health_facility")}
                eventKey={3.1}
              >
                {" "}
                <Check state={this.state.manageColomns.health_facility} /> Health facility
              </MenuItem>
             
            </NavDropdown>
          </form>
  
          <div className="padding-top content-container col-md-12">
            {this.state.isLoaded === true ? (
              <BootstrapTable
                data={deliveries}
                striped
                hover
                ref="table"
                remote={true}
                headerContainerClass="table-header"
                tableContainerClass="table-responsive table-onScreen"
                fetchInfo={{ dataTotalSize: this.state.totalDataSize }}
                pagination={true}
                options={options}
                //   exportCSV
                condensed
                pagination
              >
                <TableHeaderColumn
                  width="220px"
                  hidden={this.state.manageColomns.name}
                  dataFormat={this.nameFormatter}
                  dataSort={true}
                  dataField="first_name"
                >
                  Mother
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={true}
                  dataSort={true}
                  isKey
                  dataField="id"
                >
                  Phone number
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.state.manageColomns.village}
                  dataFormat={(cell, row, item) =>
                    this.getVillageItem(cell, row, "name")
                  }
                  dataField="village"
                >
                  Village
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.state.manageColomns.next_of_kin}
                  dataFormat={this.nextOfKinFormatter}
                  dataField="next_of_kin"
                >
                  Next of Kin
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.state.manageColomns.dob}
                  dataFormat={this.ageFormatter}
                  dataField="dob"
                >
                  Age (Years)
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.state.manageColomns.followup_reason}
                  dataField="followup_reason"
                >
                  Follow up reason
                </TableHeaderColumn>
                <TableHeaderColumn
                dataFormat={(cell, row, item)=>this.getGirlItem(cell, row, "marital_status")}
                  hidden={this.state.manageColomns.marital_status}
                  dataField="marital_status"
                >
                  Marital status
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.state.manageColomns.delivery_date}
                  dataFormat={this.dateFormatter}
                  dataField="delivery_date"
                >
                  Delivery date
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.state.manageColomns.action_taken}
                  dataField="action_taken"
                >
                  Action taken
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.state.manageColomns.received_postnatal_care}
                   dataFormat={this.enumFormatter}
                   formatExtraData={YesNoFormat}
                  dataField="received_postnatal_care"
                >
                  Received postnatal care
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.state.manageColomns.delivery}
                   dataFormat={this.deliveryFormatter}
                  dataField="delivery"
                >
                  Status of delivery
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.state.manageColomns.family_planning}
                  dataFormat={this.familyPlanningFormatter}
                  dataField="family_planning"
                >
                  Family planning
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden={this.state.manageColomns.health_facility}
                  dataField="health_facility"
                >
                  Health Facility
                </TableHeaderColumn>
                
              </BootstrapTable>
            ) : (
              <span>Loading</span>
            )}
          </div>
        </div>
      );
    }
  }

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deliveries: [],
      deliveries_copy: [],
      isLoaded: false,
      loadingText: "Loading ..",
      status: "All",
      from: prevMonthFirstDay,
      to: moment(endOfDay)
        .local()
        .format("YYYY-MM-DD"),
      showCoords: true,
      manageColomns: {
        name: false,
        village: false,
        sub_county: true,
        next_of_kin: true,
        dob: true,
        marital_status:true,

        // deliveries data
        followup_reason: true,
        action_taken: true,
        received_postnatal_care: true,
        delivery:false,
        family_planning:false,
        delivery_date: false,
        health_facility: false
      },
      // remote pagination
      currentPage: 1,
      sizePerPage: 20,
      totalDataSize: 0
    };
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
    this.getData();
  }
  getData() {
    const thisApp = this;
    thisApp.setState({
      deliveries: [],
      deliveries_copy: [],
      loadingText: "Loading..."
    });
    service.deliveries(function(error, response) {
      console.log(response);
      if (error) {
        console.log(error);
        thisApp.setState(
          {
            isLoaded: true,
            deliveries: []
          },
          () => console.log(thisApp.state)
        );
      } else {
        thisApp.setState(
          {
            isLoaded: true,
            deliveries: response.results
          },
          () => console.log(thisApp.state)
        );
      }
    });
  }
  nameFormatter(cell, row) {
    return (
      row.girl.first_name +
      " " +
      row.girl.last_name +
      " - " +
      row.girl.phone_number
    );
  }

  trimesterFormatter(cell, row) {
    return row.girl.trimester;
  }
  nextOfKinFormatter(cell, row) {
    return (
      row.girl.next_of_kin_name + " - " + row.girl.next_of_kin_phone_number
    );
  }
  getVillageItem(cell, row, item) {
    return row.girl.village[item];
  }
  getGirlItem(cell, row, item) {
    return row.girl[item];
  }
  getSubcountyItem(cell, row, item) {
    return row.girl.village.parish.sub_county[item];
  }
  updateTable(colomn) {
    //make a copy of state
    let manageColomns = this.state.manageColomns;

    if (this.state.manageColomns[colomn] === true) {
      manageColomns[colomn] = false;
      this.setState({
        manageColomns: manageColomns
      });
    } else {
      manageColomns[colomn] = true;
      this.setState({
        manageColomns: manageColomns
      });
    }
  }
  ageFormatter(cell, row) {
    return moment().diff(row.girl.dob, "years");
  }
  dateFormatter(cell) {
    console.log(cell);
    return moment(new Date(cell)).format("Do MMM YY hh a");
  }
  deliveryFormatter(cell, row) {
   // console.log(cell);
   let delivery = "";
    if(row.is_mother_alive && row.is_baby_alive){
        return delivery = "Mother Alive, Baby Alive";
    }
    else if(!row.is_mother_alive && row.is_baby_alive){
        return delivery = "Mother Dead, Baby Alive";
    }
    else if(row.is_mother_alive && !row.is_baby_alive){
        return delivery = "Mother Alive, Baby Still";
    }
    else if(row.is_mother_alive && !row.is_baby_alive){
        return delivery = "Mother Dead, Baby Still";
    }else{
        return delivery = "Not recorded";
    }
  }
  familyPlanningFormatter(cell, row) {
    // console.log(cell);
    let familyPlanning = "";
     if(row.using_family_planning){
         return familyPlanning = "Yes, "+row.family_planning_type;
     }
    else{
         return familyPlanning = "None, "+row.no_family_planning_reason;
     }
   }
  enumFormatter(cell, row, enumObject) {
    return enumObject[cell];
  }

  render() {
    let deliveries = this.state.deliveries;
    const YesNoFormat = {
      true: "Yes",
      false: "No"
    };
    const options = {
      page: this.state.currentPage, // which page you want to show as default
      onPageChange: this.onPageChange,
      onSortChange: this.onSortChange,
      onFilterChange: this.onFilterChange,
      //   sizePerPageList: xxx, // you can change the dropdown list for size per page
      sizePerPage: parseInt(this.state.sizePerPage), // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 10,
      prePage: "Prev", // Previous page button text
      nextPage: "Next", // Next page button text
      firstPage: "First", // First page button text
      paginationPosition: "bottom" // default is bottom, top and both is all available
    };
    return (
      <div className="col-md-12 bg-white-content">
        <form className="form-inline pull-right">
          <div className="form-group">
            <label htmlFor="email">From:</label>
            <input
              name="from"
              value={this.state.from}
              onChange={this.handleInputChange}
              className="form-control"
              type="date"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">To:</label>
            <input
              name="to"
              value={this.state.to}
              onChange={this.handleInputChange}
              className="form-control"
              type="date"
            />
          </div>
          <NavDropdown
            eventKey={3}
            className="pull-right"
            title="Manage columns"
            id="basic-nav-dropdown"
          >
            <MenuItem
              onClick={(e, name) => this.updateTable("name")}
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.name} /> Mother
            </MenuItem>
            <MenuItem
              onClick={(e, village) => this.updateTable("village")}
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.village} /> Village
            </MenuItem>
            {/* <MenuItem onClick={(e, sub_county) => this.updateTable("sub_county")} eventKey={3.1}> <Check state={this.state.manageColomns.sub_county} /> Sub County</MenuItem>         */}
            <MenuItem
              onClick={(e, next_of_kin_name) => this.updateTable("next_of_kin")}
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.next_of_kin} /> Next of kin
            </MenuItem>
            <MenuItem
              onClick={(e, marital_status) =>
                this.updateTable("marital_status")
              }
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.marital_status} /> Marital
              status
            </MenuItem>
             <MenuItem
              onClick={(e, followup_reason) =>
                this.updateTable("followup_reason")
              }
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.followup_reason} />{" "}
              Follow up reason
            </MenuItem>

            <MenuItem
              onClick={(e, action_taken) =>
                this.updateTable("action_taken")
              }
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.action_taken} />
              Action taken
            </MenuItem>

            <MenuItem
              onClick={(e, name) => this.updateTable("dob")}
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.dob} /> Age
            </MenuItem>

            <MenuItem
              onClick={(e, received_postnatal_care) => this.updateTable("received_postnatal_care")}
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.received_postnatal_care} /> Received postnatal care
            </MenuItem>
            <MenuItem
              onClick={(e, delivery) => this.updateTable("delivery")}
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.delivery} /> Delivery status
            </MenuItem>
            <MenuItem
              onClick={(e, family_planning) => this.updateTable("family_planning")}
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.family_planning} /> Family planning
            </MenuItem>

            <MenuItem
              onClick={(e, delivery_date) => this.updateTable("delivery_date")}
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.delivery_date} /> Date of delivery
            </MenuItem>
            <MenuItem
              onClick={(e, health_facility) => this.updateTable("health_facility")}
              eventKey={3.1}
            >
              {" "}
              <Check state={this.state.manageColomns.health_facility} /> Health facility
            </MenuItem>
           
          </NavDropdown>
        </form>

        <div className="padding-top content-container col-md-12">
          {this.state.isLoaded === true ? (
            <BootstrapTable
              data={deliveries}
              striped
              hover
              ref="table"
              remote={true}
              headerContainerClass="table-header"
              tableContainerClass="table-responsive table-onScreen"
              fetchInfo={{ dataTotalSize: this.state.totalDataSize }}
              pagination={true}
              options={options}
              //   exportCSV
              condensed
              pagination
            >
              <TableHeaderColumn
                width="220px"
                hidden={this.state.manageColomns.name}
                dataFormat={this.nameFormatter}
                dataSort={true}
                dataField="first_name"
              >
                Mother
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={true}
                dataSort={true}
                isKey
                dataField="id"
              >
                Phone number
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={this.state.manageColomns.village}
                dataFormat={(cell, row, item) =>
                  this.getVillageItem(cell, row, "name")
                }
                dataField="village"
              >
                Village
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={this.state.manageColomns.next_of_kin}
                dataFormat={this.nextOfKinFormatter}
                dataField="next_of_kin"
              >
                Next of Kin
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={this.state.manageColomns.dob}
                dataFormat={this.ageFormatter}
                dataField="dob"
              >
                Age (Years)
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={this.state.manageColomns.followup_reason}
                dataField="followup_reason"
              >
                Follow up reason
              </TableHeaderColumn>
              <TableHeaderColumn
              dataFormat={(cell, row, item)=>this.getGirlItem(cell, row, "marital_status")}
                hidden={this.state.manageColomns.marital_status}
                dataField="marital_status"
              >
                Marital status
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={this.state.manageColomns.delivery_date}
                dataFormat={this.dateFormatter}
                dataField="delivery_date"
              >
                Delivery date
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={this.state.manageColomns.action_taken}
                dataField="action_taken"
              >
                Action taken
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={this.state.manageColomns.received_postnatal_care}
                 dataFormat={this.enumFormatter}
                 formatExtraData={YesNoFormat}
                dataField="received_postnatal_care"
              >
                Received postnatal care
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={this.state.manageColomns.delivery}
                 dataFormat={this.deliveryFormatter}
                dataField="delivery"
              >
                Status of delivery
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={this.state.manageColomns.family_planning}
                dataFormat={this.familyPlanningFormatter}
                dataField="family_planning"
              >
                Family planning
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={this.state.manageColomns.health_facility}
                dataField="health_facility"
              >
                Health Facility
              </TableHeaderColumn>
              
            </BootstrapTable>
          ) : (
            <span>Loading</span>
          )}
        </div>
      </div>
    );
  }
}
// Changed from Class to function component
function Check(props){
    return (
      <React.Fragment>
        <div className="checkboxWrapper">
          <div className="disabler"></div>
          {props.state === false ? (
            <input type="checkbox" checked={true} />
          ) : (
            <input type="checkbox" checked={false} />
          )}
        </div>
      </React.Fragment>
    );
  }

