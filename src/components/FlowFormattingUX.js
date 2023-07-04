"use client";

import { useEffect, useState, forwardRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Badge from "react-bootstrap/Badge";
import CustomToggle from "./CustomToggle.jsx";
import { Container } from "react-bootstrap";

const FlowFormattingUX = forwardRef(function FlowFormattingUX(
  { elesForCyInit, loadFlowJSONFromFile, clear, reset },
  cyRef
) {
  const connectionDefaultWidth = 175;
  const connectionDefaultHeight = 140;
  const annotationDefaultWidth = 300;
  const annotationDefaultHeight = 30;
  const evalDefaultWidth = 110;
  const evalDefaultHeight = 100;
  const defaultAnimationDuration = 1;
  const maxAnimationDuration = 1000;
  const minAnimationDuration = 1;
  const [aniDur, setAniDur] = useState(defaultAnimationDuration);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isInstant, setIsInstant] = useState(false);

  const toggleAccordion = () => {
    const currAccState = !isAccordionOpen;
    setIsAccordionOpen(currAccState);
  };

  const onAnimationDurationChange = (e) => {
    e.preventDefault();
    setAniDur(Number(e.currentTarget.value));
  };

  const renderTooltipAnimationDurationMillis = (props) => (
    <Tooltip
      id="button-tooltip"
      className="text-light"
      {...props}>
      <p className="text-white">
        Greater values will slow down the animation. You can also analyze
        what&apos;s happening while at slower speeds by clicking on{" "}
        <i>Description</i> down below
      </p>
    </Tooltip>
  );

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.ready((event) => {
        console.log("event.target", event.target);

        cyRef.current.on("vclick", '[nodeType = "CONNECTION"]', (event) => {
          console.log("event.target", event.target);
        });
      });
    }
  }, [cyRef.current]);

  return (
    <Container
      fluid
      className="p-1 m-0 h-100 bg-primary justify-content-center overflow-hidden">
      <CytoscapeComponent
        id="cy"
        className="p-1 m-1"
        elements={elesForCyInit}
        layout={{ name: "preset" }}
        style={{
          width: "100%",
          height: "100%",
        }}
        cy={(cy) => {
          cyRef.current = cy;
        }}
        wheelSensitivity={0.1}
        zoom={4}
        boxSelectionEnabled={false}
        autoungrabify={true}
        autounselectify={true}
        stylesheet={[
          {
            selector: '[nodeType = "CONNECTION"]',
            style: {
              "shape": "rectangle",

              "width": connectionDefaultWidth,
              "height": connectionDefaultHeight,
              "background-opacity": 1,
              "background-color": (ele) => {
                const props = ele.data("properties");
                const bgColor = props?.backgroundColor?.value;

                if (bgColor) {
                  return bgColor.slice(0, 7);
                }

                return "#A4B7D5";
              },
              "background-blacken": 0,
              "label": (ele) => {
                const eleProps = ele.data("properties");
                const title = eleProps?.nodeTitle?.value;
                const label = ele.data("label");

                let firstRowLabel = title || label || "connection";
                return (
                  firstRowLabel +
                  "\n" +
                  ele.id() +
                  "\n(" +
                  new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 0,
                    useGrouping: false,
                  }).format(ele.position("x")) +
                  "," +
                  new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 0,
                    useGrouping: false,
                  }).format(ele.position("y")) +
                  ")"
                );
              },

              "font-size": 16,
              "text-opacity": 1.0,
              "text-wrap": "wrap",
              "text-valign": "center",
              "text-margin-y": 5,
              "text-transform": "lowercase",
              "text-outline-opacity": "1",
              "text-outline-color": "#F0F66E",
              "text-outline-width": 0.1,
              "text-max-width": (ele) => {
                const eleProps = ele.data("properties");
                return eleProps?.width?.value || connectionDefaultWidth;
              },
              "line-height": 1.1,
              "color": "#000000",
              "z-index": 5,
              "z-index-compare": "manual",
            },
          },
          {
            selector: '[nodeType = "EVAL"]',
            style: {
              "shape": "round-diamond",
              "width": evalDefaultWidth,
              "height": evalDefaultHeight,
              "background-opacity": 1,
              "background-color": "#ee6c4d",
              "background-blacken": 0.2,
              "label": (ele) => {
                const eleProps = ele.data("properties");

                if (eleProps) {
                  let s = ele.id() + "\n";

                  for (let p of Object.values(eleProps)) {
                    s += p.value;
                    s += " ";
                  }

                  return s;
                }

                return ele.id();
              },
              "font-size": 12,
              "text-opacity": 1,
              "text-wrap": "wrap",
              "text-valign": "center",
              "text-margin-y": 0,
              "text-transform": "lowercase",
              "text-outline-opacity": "1",
              "text-outline-color": "#F0F66E",
              "text-outline-width": 0.1,
              "text-max-width": (ele) => {
                const eleProps = ele.data("properties");
                return eleProps?.width?.value || evalDefaultWidth;
              },
              "line-height": 1.1,
              "color": "#FAFAFF",
              "z-index": 1,
              "z-index-compare": "manual",
            },
          },
          {
            selector: '[nodeType = "ANNOTATION"]',
            style: {
              "shape": "rectangle",
              "width": (ele) => {
                const eleProps = ele.data("properties");
                const width = eleProps?.width?.value;

                if (width) {
                  return width;
                }

                return annotationDefaultWidth;
              },
              "height": (ele) => {
                const eleProps = ele.data("properties");
                const height = eleProps?.height?.value;

                if (height) {
                  return height;
                }

                return annotationDefaultHeight;
              },
              "background-opacity": 0.5,
              "background-color": (ele) => {
                const props = ele.data("properties");
                const bgColor = props?.backgroundColor?.value;

                if (bgColor) {
                  return bgColor.slice(0, 7);
                }

                return "#f2f3f4";
              },
              "background-blacken": 0.25,
              "label": (ele) => {
                const eleProps = ele.data("properties");
                return eleProps?.annotation?.value || "annotation";
              },
              "font-size": 15,
              "text-opacity": 0.95,
              "text-wrap": "wrap",
              "text-valign": "center",
              "text-margin-y": 0,
              "text-transform": "lowercase",
              "text-outline-opacity": "1",
              "text-outline-color": "#F0F66E",
              "text-outline-width": 0.1,
              "text-max-width": (ele) => {
                const eleProps = ele.data("properties");
                return eleProps?.width?.value || annotationDefaultWidth;
              },
              "line-height": 1.1,
              "color": "#FFFaaa",
              "z-index": 0,
              "z-index-compare": "manual",
            },
          },
          {
            selector: "edge",
            style: {
              "width": 5,
              "color": "#4E937A",
              "opacity": 0.7,
              "font-size": "12",
              "text-justification": "center",
              "text-margin-x": "-10",
              "text-margin-y": "20",
              "text-rotation": "autorotate",
              "text-wrap": "wrap",
              "text-valign": "bottom",
              "label": (ele) =>
                "\u0394" +
                "x:" +
                new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  useGrouping: false,
                }).format(
                  ele.target().position("x") - ele.source().position("x")
                ) +
                "\n" +
                "\u0394" +
                "y:" +
                new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  useGrouping: false,
                }).format(
                  ele.target().position("y") - ele.source().position("y")
                ),
              "line-color": "#0A81D1",
              "line-opacity": 1,
              "target-arrow-color": "#000",
              "target-arrow-shape": "triangle-backcurve",
              "curve-style": "bezier",
              "source-endpoint": "outside-to-line-or-label",
              "target-endpoint": "outside-to-line-or-label",
              "source-distance-from-node": 3,
              "target-distance-from-node": 1,
              "arrow-scale": 2,
              "z-index": 2,
              "z-index-compare": "manual",
            },
          },
        ]}
      />

      <Form className="fixed-bottom w-100 p-1 m-0 d-flex">
        <Row className="p-0 m-0 w-100 row-cols-auto justify-content-between flex-nowrap align-items-end gap-2">
          <Col className="p-0 m-0 d-flex flex-grow-0 flex-shrink-10">
            <Button
              variant="danger"
              size="sm"
              className="py-1 px-2 m-0 opacity-75 align-self-end"
              onClick={(e) => clear(e)}>
              <p className="p-0 m-0 display-9 fw-semibold">Home</p>
            </Button>
          </Col>

          <Col
            id="animationConfigCol"
            className="p-0 m-0 d-flex flex-column flex-grow-0 flex-shrink-10">
            <Form.Text
              id="isInstantText"
              className="text-info">
              Want a toggle?
            </Form.Text>
            <ToggleButtonGroup
              type="radio"
              name="isInstantToggleGroup"
              value={isInstant}
              onChange={setIsInstant}
              className="p-0 m-0"
              style={{ height: "1.5rem" }}>
              <ToggleButton
                id="instantToggleOn"
                value={true}
                variant="outline-success"
                className="rounded-0 fs-7 text-center p-0 m-0">
                On
              </ToggleButton>
              <ToggleButton
                id="instantToggleOff"
                value={false}
                variant="outline-danger"
                className="rounded-0 fs-7 text-center p-0 m-0">
                Off
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>

          <Col className="p-0 m-0 d-flex justify-content-center flex-grow-0 flex-shrink-10 h-100">
            <Form.Floating className="p-0 m-0 h-100 d-flex flex-column flex-grow-0 flex-shrink-10 justify-content-center">
              <Form.Range
                value={aniDur}
                min={minAnimationDuration}
                max={maxAnimationDuration}
                step={1}
                onChange={(e) => onAnimationDurationChange(e)}
                className="p-0 m-0 flex-grow-0 flex-shrink-10"
              />
              <Form.Label
                className="p-0 m-0 w-100 d-flex flex-grow-0 flex-shrink-10  text-center align-items-end"
                placeholder={1}>
                <p className="p-0 m-0 text-light w-100 text-nowrap">
                  <small className="p-0 m-0">{aniDur}</small>
                </p>
              </Form.Label>
            </Form.Floating>
          </Col>

          <Col className="p-0 m-0 d-flex flex-grow-0 flex-shrink-10">
            <OverlayTrigger
              placement="left"
              delay={{ show: 200, hide: 800 }}
              overlay={renderTooltipAnimationDurationMillis}>
              {({ ref, ...triggerHandler }) => (
                <Button
                  {...triggerHandler}
                  className="p-0 m-0 d-inline-flex align-items-center rounded-5 border-0">
                  <Badge
                    ref={ref}
                    pill
                    bg="secondary"
                    className="fs-8 text-light">
                    ?
                  </Badge>
                </Button>
              )}
            </OverlayTrigger>
          </Col>

          <Col className="p-0 m-0 flex-grow-100 flex-shrink-1">
            <Form.Group
              controlId="formFileLg"
              className="">
              <Form.Label className="text-light text-nowrap small m-0">
                Upload Different JSON
              </Form.Label>
              <Form.Control
                type="file"
                size="sm"
                className="dark"
                onChange={(e) => loadFlowJSONFromFile(e)}
              />
            </Form.Group>
          </Col>

          <Col className="p-0 m-0 d-flex flex-grow-10 flex-shrink-1">
            <Button
              className="p-1 opacity-75 align-self-end"
              variant="secondary"
              size="sm"
              href="https://pingidentity.com/signon"
              target="_blank">
              <p className="p-0 m-0 display-8 text-body text-nowrap fw-bold fst-italic">
                PingOne DaVinci
              </p>
            </Button>
          </Col>

          <Col className="p-0 m-0 d-flex">
            <p
              id="dombrowski"
              className="text-info p-0 m-0">
              <small>@dombrowski</small>
            </p>
          </Col>
        </Row>
      </Form>
    </Container>
  );
});

export default FlowFormattingUX;
