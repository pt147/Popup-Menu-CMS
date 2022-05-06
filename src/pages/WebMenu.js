import React, { useEffect, useRef, useState } from "react";
import "./../CSS/homepage.css";
import "./../CSS/itemAlert.css";
import "./../CSS/menuPage.css";
import { ItemDrop, ItemView, CategoryView } from "../component/ItemDrop";
import { EVENTDETAIL, FETCH_ORDERS, FETCH_COLOR_SETTINGS, POST_METHOD, GET_METHOD } from "../apis/apiHelper";
import useHttp from "../hooks/use-http";
import { useParams } from "react-router";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { eventAction } from "../store/events-slice";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";


function Homepage() {
    const [menu, setMenu] = useState(null);
    const [isDetailsMode, setDetailsMode] = useState(false);
    const [event, setEvent] = useState();
    const [selectedItems, setSelectedItems] = useState();
    const { sendRequest: getMenuApi, sendRequest: getEventDetailsApi, sendRequest: fetchColorSettingsAPI, isLoading, error } = useHttp();
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const arrayId = eventId.split("-");
    const { t } = useTranslation();
    const [showModal, setModal] = useState(false);
    const [currentItem, setCurrentItem] = useState("");
    const menuRef = useRef(null)

    var backgroundColor = null;

    const geteventDetails = () => {
        getEventDetailsApi(
            {
                url: EVENTDETAIL,
                method: POST_METHOD,
                body: {
                  user_id: 22,
                  id: arrayId[0].trim(),
                },
            },
            (response) => {
                setEvent(response.data);
                console.log("Event: ", response);
                dispatch(eventAction.setName(response?.data?.title));

                /*if (response.data.id === 337){
                  backgroundColor = "rgba(76, 105, 112, 255)";
                  document.body.style.backgroundColor = backgroundColor;
                  document.getElementById("nav-content").style.backgroundColor = backgroundColor;
                  document.getElementById("card").style.backgroundColor = backgroundColor;

                  document.getElementById("event-description").style.color = "white";
                }*/
            }
        );
        fetchColorSettingsAPI(
            {
                url: FETCH_COLOR_SETTINGS + "/" + arrayId[0].trim(),
                method: GET_METHOD
            },
            (response) => {
                console.log(response);
                document.body.style.backgroundColor = response.data.bgMenuColor;
                document.getElementById("nav-content").style.backgroundColor = response.data.bgMenuColor;
                document.getElementById("card").style.backgroundColor = response.data.bgMenuColor;
                document.body.style.fontFamily = response.data.fontFamily;
            }
        );
    };

    useEffect(() => {
        getMenuApi(
            {
                url: FETCH_ORDERS,
                method: POST_METHOD,
                body: {
                  //event_id: 248,
                  event_id: arrayId[0].trim(),
                },
            },
            (response) => {
              console.log(response);
              const submenus = response.data.subMenuDtos;
              const categories = response.data.menuCategoryDtos;
              const all_items = response.data.items;

              const most_items = all_items.filter(item => item.is_available === true);
              const items = most_items.filter(item => categories.some(category => category.id === item.category_id));

              submenus.sort((submenu1, submenu2) => {
                  return submenu1.position - submenu2.position;
              })
              categories.sort((category1, category2) => {
                  return category1.position - category2.position;
              })

              const noParentItems = [];
              const noParentCategories = [];

              items.forEach(item => {
                if (item.category_id === null && item.sub_menu_ids.length === 0){
                  noParentItems.push(item);
                }else if (item.sub_menu_ids.length === 0){
                  if (!noParentCategories.some(noParentCategory => noParentCategory.id === item.category_id)){
                    const new_noParentCategory = categories.find((category) => {
                      return category.id === item.category_id;
                    });
                    noParentCategories.push(new_noParentCategory);
                  }
                }
              });

              const my_noParentCategories = [];
              const my_noParentCategoryItems = [];
              var i = 0;
              noParentCategories.forEach(noParentCategory => {
                my_noParentCategoryItems.push([]);
                items.forEach(item => {
                  if (item.sub_menu_ids.length === 0 && item.category_id === noParentCategory.id){
                    my_noParentCategoryItems[i].push(item);
                  }
                });
                i++;
              });

              var i = 0;
              noParentCategories.forEach(noParentCategory => {
                const my_noParentCategory = {
                  category: noParentCategory,
                  items: my_noParentCategoryItems[i]
                }
                my_noParentCategories.push(my_noParentCategory);
                i++;
              })

              const my_categories = [];
              const my_pre_items = [];
              const my_items = [];

              var i = 0;
              submenus.forEach(submenu => {
                my_categories.push([]);
                my_pre_items.push([]);
                my_items.push([]);
                items.forEach(item => {
                  if (item.sub_menu_ids.some(submenu_id => submenu_id === submenu.id)){
                    if (item.category_id === null){
                      my_items[i].push(item);
                    }else{
                      if (!my_categories[i].some(my_category => my_category.id === item.category_id)){
                        const newCategory = categories.find(category => category.id === item.category_id);
                        my_categories[i].push(newCategory);
                      }
                    }
                  }
                });
                i++;
              });

              var i = 0;
              submenus.forEach(submenu => {
                my_items.push([]);
                var j = 0;
                my_categories[i].forEach(category => {
                  my_items[i].push([]);
                  items.forEach(item => {
                    if (item.category_id === category.id && item.sub_menu_ids.some(submenu_id => submenu_id === submenu.id)){
                      my_items[i][j].push(item);
                    }
                  });
                  j++;
                });
                i++;
              });

              var i = 0;
              const array_struct_submenu = [];
              submenus.forEach(submenu => {
                var j = 0;
                const array_struct_categories = [];
                my_categories[i].forEach(category => {
                  const struct_category = {
                    category: category,
                    items: my_items[i][j]
                  }
                  array_struct_categories.push(struct_category);
                  j++;
                });
                array_struct_categories.sort((category1, category2) =>{
                  return category1.category.position - category2.category.position;
                });
                const struct_submenu = {
                  submenu: submenu,
                  categories: array_struct_categories,
                  items: my_pre_items[i]
                }
                array_struct_submenu.push(struct_submenu);
                i++;
              });
              array_struct_submenu.sort((submenu1, submenu2) =>{
                return submenu1.submenu.position - submenu2.submenu.position;
              });

              my_noParentCategories.sort((category1, category2) =>{
                return category1.category.position - category2.category.position;
              });

              if (my_noParentCategories.length > 0 || noParentItems.length > 0){
                const default_submenu = {
                  submenu: {"name": "Menu"},
                  categories: my_noParentCategories,
                  items: noParentItems
                }
                array_struct_submenu.push(default_submenu);
              }

              const struct_menu = {
                submenus: array_struct_submenu,
                categories: [],
                items: []
              }

              setMenu(struct_menu);
            }
        )
        setSelectedItems([]);
        geteventDetails();
        checkButtonEnable(); //TODO: uncomment
    }, []);

    function haveCommonElements(arr1, arr2) {
        return arr1.some(item => arr2.includes(item));
    }
    
    function leftClick(item){
        var mySelectedItems = selectedItems;
        var orderWithdrawTypes = ["serveAtTable", "counter"];
        var submenu_id = null;
        mySelectedItems.forEach(item => {
            submenu_id = item.parentSubmenu.id;
            orderWithdrawTypes = orderWithdrawTypes.filter(orderWithdrawType => item.orderWithdrawTypes.includes(orderWithdrawType));
        });
        var my_item = mySelectedItems.find(my_item => my_item.id === item.id);
        if (submenu_id ? item.parentSubmenu.id === submenu_id : true && haveCommonElements(orderWithdrawTypes, item.orderWithdrawTypes)){
            if (my_item){
                if (my_item.quantity > 0){
                    my_item.quantity--;
                }
            }else{
                item.quantity = 1;
                my_item = item;
                mySelectedItems.push(item);
            }
            setSelectedItems(mySelectedItems);
            document.getElementById("banner-quantity-text-" + item.id).value = my_item.quantity;
            checkButtonEnable();
        }
    }

    function rightClick(item){
        var mySelectedItems = selectedItems;
        var orderWithdrawTypes = ["serveAtTable", "counter"];
        var submenu_id = null;
        mySelectedItems.forEach(item => {
            submenu_id = item.parentSubmenu.id;
            orderWithdrawTypes = orderWithdrawTypes.filter(orderWithdrawType => item.orderWithdrawTypes.includes(orderWithdrawType));
        });
        var my_item = mySelectedItems.find(my_item => my_item.id === item.id);
        if (submenu_id ? item.parentSubmenu.id === submenu_id : true){
            if (haveCommonElements(orderWithdrawTypes, item.orderWithdrawTypes)){
                if (my_item){
                    if (my_item.quantity < item.available){
                        my_item.quantity++;
                    }
                }else{
                    item.quantity = 1;
                    my_item = item;
                    mySelectedItems.push(item);
                }
                setSelectedItems(mySelectedItems);
                document.getElementById("banner-quantity-text-" + item.id).value = my_item.quantity;
                checkButtonEnable();
            }else{
                alert("Non puoi aggiungere questo prodotto perché è incompatibile con la modalità di consegna degli altri prodotti selezionati");
            }
        }else{
            alert("Non puoi aggiungere questo prodotto perché appartiene ad un altro menù rispetto agli altri prodotti selezionati");
        }
    }

    function checkButtonEnable(){
        if (selectedItems){
            if (selectedItems.filter(item => item.quantity > 0).length > 0){
                document.getElementById("confirm-button").disabled = false;
            }else{
                document.getElementById("confirm-button").disabled = true;
            }
        }else{
            document.getElementById("confirm-button").disabled = true;
        }
    }

    const gotoCheckout = () => {
        var url = "/MenuCheckout/" + arrayId[0];
        selectedItems.forEach(item => {
          if(item.quantity > 0){
              url = url + "-" + item.id + "-" + item.quantity;
            }
        });
        window.location.href = url;
    }

    return (
        <>
        <div className="container-main mt-1" >
          <div className="nav-content" id="nav-content">
            <Row className="justify-content-sm-center">
              <Col xl={6}>
                <Card className="curved border-0 " id="card">
                  <Card.Body className="p-4">
                  <center>
                    {
                      event?.images.find(image => image.banner_url).banner_url &&
                        <img 
                          className="d-block w-50 h-50 curved center"
                          src={event?.images.find(image => image.banner_url).banner_url}
                          //alt={`${carousel.id} slide`}
                        />
                    }</center>
                    {/*<Carousel controls={event?.images?.length > 1}>
                      {event?.images?.map((carousel, i) => (
                        <Carousel.Item
                          key={i}
                          className="d-flex justify-content-center"
                        >
                          <img
                            className="d-block w-50 h-50 curved center"
                            src={carousel.banner_url}
                            alt={`${carousel.id} slide`}
                          />
                          {/* <Carousel.Caption className="d-md-block">
                          <h5 className={"event-title"}>{event?.title}</h5>
                          </Carousel.Caption> */}
                        {/*</Carousel.Item>
                      ))}
                    </Carousel>*/}
                    {/* {isDetailsMode && event && ( */}
                    <div>
                      <div className="new_title mt-3">{event?.title}</div>
                      {event && (
                        <div className="mt-3">
                          {/*<ReadMoreReact
                            text={event?.description ?? "lorem ipsum"}
                            min={120}
                            ideal={200}
                            max={300}
                            readMoreText={"Read More"}
                          />*/}
                          {/*<div id="event-description" className="event-description">
                            {event?.description ?? "lorem ipsum"}
                          </div>*/}
                        </div>
                      )}
                    </div>
                    {/* )} */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          

            {/* {event && (
              <div className="btn-container">
                <button
                  className={`view-more-btn ${
                    isDetailsMode && `margin-bottom-6rem`
                  }`}
                  onClick={() => {
                    setDetailsMode((value) => !value);
                  }}
                >
                  {isDetailsMode ? t("viewMenu") : t("viewDetails")}
                </button>
              </div>
            )} */}
            
            {!isDetailsMode && (
                <div className="menu_container">
                    {
                        menu &&
                        menu.items.map(item => {
                            return (
                                <ItemView 
                                    selectedItems = {selectedItems}
                                    parentCategory = {null}
                                    image = {null}
                                    name = {item.title}
                                    description = {item.description}
                                    price = {item.price}
                                    onLeftClick = {leftClick}
                                    onRightClick = {rightClick}
                                    onItemClick = {(item) => {
                                        setModal((visible) => !visible);
                                        setCurrentItem(item);
                                    }}
                                    food_side_effect = {item.food_side_effect}
                                />
                            ); 
                        })
                    }
                  {
                      menu &&
                      menu.categories.map(category => {
                          return (
                              <div
                                  key={category.category.name}
                                  className="menu_row"
                              >
                                <CategoryView
                                    selectedItems = {selectedItems}
                                    category = {category.category}
                                    items = {category.items}
                                    onLeftClick = {leftClick}
                                    onRightClick = {rightClick}
                                    onItemClick = {(item) => {
                                        setModal((visible) => !visible);
                                        setCurrentItem(item);
                                    }}
                                />
                            </div>
                          ); 
                      })
                  }
                  {
                      menu &&
                      menu.submenus.map(submenu => {
                          return (
                              <div
                                  key={submenu.submenu.name}
                                  className="menu_row menu_first_row"
                              >
                                <ItemDrop
                                    selectedItems = {selectedItems}
                                    submenu = {submenu.submenu}
                                    categories = {submenu.categories}
                                    onLeftClick = {leftClick}
                                    onRightClick = {rightClick}
                                    onItemClick = {(item) => {
                                        setModal((visible) => !visible);
                                        setCurrentItem(item);
                                    }}
                                    my_status = {menu.submenus.length !== 1}
                                />
                              </div>
                          );
                      })
                  }
                
                  <center>
                  <Modal centered show={showModal} onHide={() => setModal(false)} contentClassName="modal_container" style={{borderRadius: "30px"}}>
                    <Modal.Body>
                      <div className="item_container">
                        <img className="item_image" src={currentItem?.image} alt={currentItem?.image} />
                        <div className="item_title">
                          {currentItem?.name}
                        </div>
                        <div class="x_button" onClick={() => setModal(false)}>×</div>
                        <div className="item_price_container">
                          <div className="item_price">
                            {currentItem?.price} €
                          </div>
                        </div>
                        <div className="item_description">
                          {currentItem?.description}
                        </div>

                        {/* <div
                          style={{
                            width: "100%",
                            flex: 2,
                          }}
                        >
                          <span>{imageURI?.name}</span>
                          <span>{imageURI?.description}</span>
                        </div> */}
                      </div>
                    </Modal.Body>

                    { currentItem?.food_side_effect != "" &&
                      <Modal.Footer>
                        <div className="item_description">
                          ALLERGENI: {currentItem?.food_side_effect}
                        </div>
                      </Modal.Footer>
                    }
                  </Modal>
                  </center>

                  <center>
                      <button id="confirm-button" className="subevent-booking-confirm-button" onClick={() => gotoCheckout()}>
                          Prosegui
                      </button>
                  </center>
                  
                  <div style={{ height: "120px" }}>
                  </div>
              </div>

            )}
          </div>
        </div>
        </>
    );
}

export default Homepage;