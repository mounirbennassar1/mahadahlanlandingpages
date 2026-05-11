// Prevent FontAwesome from auto-inserting its CSS at runtime; we import the
// stylesheet ourselves in globals.css so server-rendered icons don't flash.
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
