// A palette of colors used to color distinct node labels
Define(COLOR_PALETTE, AsArray(
  #DD2222, #FB6E00, #FFC500, #720096,
  #5E4FA2, #3288BD, #66C2A5, #ABDDA4,
  #E6F598, #FEE08B, #D53E4F, #9E0142
))
Define(COLOR_PALETTE_ITER, AsIterator(COLOR_PALETTE))

// If there are no palette colors to use, use random colors instead
Define(RandomColor, Function(RGB(RandomInt(255), RandomInt(255), RandomInt(255))))
Define(GetNextColor, Function(
  Coalesce(Next(COLOR_PALETTE_ITER), RandomColor())
))

// Cache map to keep a selected color for each node label
Define(ColorByLabel, AsMap())
Define(GetColorByLabel, Function(labels, Coalesce(
  Get(ColorByLabel, labels),
  Set(ColorByLabel, labels, GetNextColor())
)))
Define(JoinLabels, Function(labels, Join(Sort(labels), ":")))

// Baseline node style that will be applied to every single node
@NodeStyle {
  Define(COLOR, GetColorByLabel(JoinLabels(Labels(node))))

  size: 6
  color: COLOR
  color-hover: Lighter(COLOR)
  color-selected: Darker(COLOR)
  border-width: 0.6
  border-color: #1D1D1D
  font-size: 3
  font-color: #1D1D1D
}

// Green for active nodes
@NodeStyle HasProperty(node, "status") {
  color: #00FF00
}

// Red for inactive nodes - this should override the above
@NodeStyle HasProperty(node, "status") {
  color: #FF0000
}

// Overwrite node text with the node label if defined
@NodeStyle Greater(Size(Labels(node)), 0) {
  label: Format(":{}", Join(Labels(node), " :"))
}

// Overwrite node text with the property "name" if defined
@NodeStyle HasProperty(node, "name") {
  label: AsText(Property(node, "name"))
}

Define(LATITUDE_FIELD, "lat")
Define(LONGITUDE_FIELD, "lng")

// In the case of numeric latitude and longitude properties, set them up for a switch to a map view
@NodeStyle And(IsNumber(Property(node, LATITUDE_FIELD)), IsNumber(Property(node, LONGITUDE_FIELD))) {
  latitude: Property(node, LATITUDE_FIELD)
  longitude: Property(node, LONGITUDE_FIELD)
}

// Baseline edge style that will be applied to every single edge
@EdgeStyle {
  color: #999999
  color-hover: #1D1D1D
  color-selected: #1D1D1D
  width: 0.3
  width-hover: 0.9
  width-selected: 0.9
  font-size: 3
  font-color: #1D1D1D
}

// Show edge text only if there is a small number of edges in the view
@EdgeStyle Less(EdgeCount(graph), 30) {
  label: Type(edge)
}

// Default view styles
@ViewStyle {
  view: "default"
  background-color: #FFFFFF00
  map-tile-layer: "light"
}