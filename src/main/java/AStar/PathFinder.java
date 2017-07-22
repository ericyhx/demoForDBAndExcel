package AStar;

import bean.BasePoint;
import bean.EasyCompare;
import bean.RobotCar;
import bean.WayPoint;
import com.dasun.rds.bean.BasePoint;
import com.dasun.rds.bean.RobotCar;
import com.dasun.rds.bean.Task;
import com.dasun.rds.bean.WayPoint;
import com.dasun.rds.tools.*;

import java.util.*;

/**
 * Created by erita on 2017/7/10.
 */
public class PathFinder {
    private List<WayPoint> closeList = new ArrayList<>();
    private List<WayPoint> openList = new ArrayList<>();
    private BasePoint start;
    private BasePoint end;
    private int state;
    private RobotCar car;
    private int count = 0;
    private EasyCompare compare = new EasyCompare();

    public PathFinder(BasePoint start, BasePoint end, RobotCar car) {
        this.start = start;
        this.end = end;
        this.state = car.getAGV_Loading();
        this.car = car;
    }

    public WayPoint findPointInOpenList() {
        Collections.sort(openList, compare);
        WayPoint first = openList.remove(0);
        return first;
    }

    public List<WayPoint> findAround(WayPoint current, BasePoint end) {
        List<WayPoint> around = new ArrayList<>();
        int x = current.getLocation().getMap_X();
        int y = current.getLocation().getMap_Y();
        BasePoint left = MapUtil.getInstance().findMapByDirection(x - 1, y);
        BasePoint right = MapUtil.getInstance().findMapByDirection(x + 1, y);
        BasePoint down = MapUtil.getInstance().findMapByDirection(x, y - 1);
        BasePoint up = MapUtil.getInstance().findMapByDirection(x, y + 1);
        //判断是否是终点
        if (end.equals(left)) {
            return addEndToAround(left, current);
        }
        if (end.equals(right)) {
            return addEndToAround(right, current);
        }
        if (end.equals(down)) {
            return addEndToAround(down, current);
        }
        if (end.equals(up)) {
            return addEndToAround(up, current);
        }
        //非终点的情况下判断周围的可行点
        if (y < 4) {
            if (y % 2 == 1) {
                WayPoint lefts = current.checkNextInflection(left, state);
                if (lefts != null) {
                    around.add(lefts);
                }
            } else {
                WayPoint rights = current.checkNextInflection(right, state);
                if (rights != null) {
                    around.add(rights);
                }
            }
            WayPoint ups = current.checkNextInflection(up, state);
            if (ups != null) {
                around.add(ups);
            }
            WayPoint downs = current.checkNextInflection(down, state);
            if (downs != null) {
                around.add(downs);
            }

        } else {
            WayPoint lefts = current.checkNextInflection(left, state);
            if (lefts != null) {
                around.add(lefts);
            }
            WayPoint rights = current.checkNextInflection(right, state);
            if (rights != null) {
                around.add(rights);
            }
            WayPoint downs = current.checkNextInflection(down, state);
            if (downs != null) {
                around.add(downs);
            }
            WayPoint ups = current.checkNextInflection(up, state);
            if (ups != null) {
                around.add(ups);
            }
        }
        return around;
    }

    private List<WayPoint> addEndToAround(BasePoint point, WayPoint current) {
        List<WayPoint> around = new ArrayList<>();
        WayPoint downs = current.checkNextInflection(point, state);
        if (downs == null) {
            System.err.println("ups is null!!!must check some error!");
            return around;
        }
        around.add(downs);
        return around;
    }

    public LinkedList<WayPoint> findWay() {
        LinkedList<WayPoint> roads = new LinkedList<>();
        WayPoint startWay = new WayPoint(start, start, end, car);
        openList.add(startWay);
        if (start.equals(end)) {
            roads.add(startWay);
            System.out.println("the car:" + car.getAGV_ID() + "roads is ::" + StringTools.listToString(roads));
            return roads;
        }
        while (!openList.isEmpty() && count < 5000) {
            WayPoint first = findPointInOpenList();
            if (first == null) {
                System.err.println("Get null point from open list!");
                break;
            }
            closeList.add(first);
            if (first.getLocation().getMap_tag() == end.getMap_tag()) {
                System.err.println("has find last");
                break;
            }
            List<WayPoint> around = findAround(first, end);
            count++;
            for (WayPoint wp : around) {
                if (!containsPoint(2, wp) && !containsPoint(1, wp)) {
                    openList.add(wp);
                } else if (containsPoint(1, wp)) {
                    int index = getIndexOfPoint(1, wp);
                    WayPoint temp = openList.get(index);
                    if (temp.getDist() > wp.getDist()) {
                        openList.set(index, wp);
                    }
                } else {
                    int index = getIndexOfPoint(2, wp);
                    WayPoint hasPut = closeList.get(index);
                    if (hasPut.getDist() > wp.getDist()) {
                        closeList.remove(hasPut);
                        openList.add(wp);
                    }
                }
            }
        }
        int endIndex = endIndexInClose(end);
        if (endIndex != -1) {
            WayPoint last = closeList.get(endIndex);
            while (last != null) {
                roads.addFirst(last);
                last = last.getParent();
            }
        }
        System.out.println("the car:" + car.getAGV_ID() + "roads is ::" + StringTools.listToString(roads));
        return roads;
    }

    private BasePoint findNextWithParent(WayPoint parent, int flag) {
        int x = parent.getLocation().getMap_X();
        int y = parent.getLocation().getMap_Y();
        if (flag == 1) {//沿x方向向后行驶
            BasePoint next = MapUtil.getInstance().findTagWithFix(x - 1, y);
            return next;
        } else if (flag == 2) {//沿x方向向前行驶
            return MapUtil.getInstance().findTagWithFix(x + 1, y);

        } else if (flag == 3) {//沿y方向向后行驶
            return MapUtil.getInstance().findTagWithFix(x, y - 1);

        } else if (flag == 4) {//沿y方向向前行驶
            return MapUtil.getInstance().findTagWithFix(x, y + 1);

        }
        return null;
    }

    private int endIndexInClose(BasePoint end) {
        int index = -1;
        for (WayPoint p : closeList) {
            if (p.getLocation().getMap_tag() == end.getMap_tag()) {
                return closeList.indexOf(p);
            }
        }
        System.out.println();
        return -1;
    }

    private int getIndexOfPoint(int flag, WayPoint wp) {
        List<WayPoint> temps;
        if (flag == 1) {
            temps = openList;
        } else {
            temps = closeList;
        }
        for (int i = 0; i < temps.size(); i++) {
            WayPoint point = temps.get(i);
            if (point.getLocation().getMap_X() == wp.getLocation().getMap_X() && point.getLocation().getMap_Y() == wp.getLocation().getMap_Y()) {
                return i;
            }
        }
        return -1;
    }

    private boolean containsPoint(int flag, WayPoint wp) {
        if (wp == null) {
            return false;
        }
        BasePoint baseLocation = wp.getLocation();
        if (baseLocation == null) {
            return false;
        }
        List<WayPoint> temps;
        if (flag == 1) {
            temps = openList;
        } else {
            temps = closeList;
        }
        for (WayPoint point : temps) {
            if (point == null) {
                continue;
            } else {
            }
            if (point.getLocation().getMap_tag() == wp.getLocation().getMap_tag()) {
                return true;
            }
        }
        return false;
    }
}