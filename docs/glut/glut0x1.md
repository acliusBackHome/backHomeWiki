# Polyline Editor

## Description

Using a mouse and keyboard to do polyline editing.

![](http://image-pic-markdown.test.upcdn.net/img/20190926181837.png)

(a) A house in the process of being drawn. The user has just clicked at the position drawn, and a line has been drawn from the previous point to the one designated by the mouse.
(b) Moving a point. The user positions the cursor near the vertex of some polyline, presses down the mouse button, and “drags” the chosen point to some other location before releasing the button. Upon release of the button, the previous lines connected to this point are erased, and new lines are drawn to it.
(c) A point is deleted from a polyline. The user clicks near the vertex of some polyline, and the two line segments connected to that vertex are erased. Then the two other endpoints of the segments just erased are connected with a line segment.

The functionality of the program should include the following “actions”:

* Begin     (‘b’)  (create a new polyline)
* Delete    (‘d’)  (delete the next point pointed to)
* Move      (‘m’)  (drag the point pointed to to a new location)
* Refresh   (‘r’)  (erase the screen and redraw all the polylines)
* Quit      (‘q’)  (exit from the program)

## Example

```C++
#include <bits/stdc++.h>
#include <windows.h>
#include <GL/glut.h>

using namespace std;

void myDrawInit();
void myDisplay();

typedef pair<GLfloat, GLfloat> P;

struct BASE_CONFIG {
    float windows_w;
    float windows_h;
    string windows_title;
    float vp_x;
    float vp_y;
    float vp_w;
    float vp_h;
    float point_size;
    float flt_max;
} config = {
    windows_w: 600.0f,
    windows_h: 600.0f,
    windows_title: "hello world",
    vp_x: -300.0f,
    vp_y: -300.0f,
    vp_w: 300.0f,
    vp_h: 300.0f,
    point_size: 1.0f,
    flt_max: 20.0f * 20.0f,
};

vector< vector<P> > myLines;
vector<P> tmpLine;

struct MOVE_NODE {
    int i;
    int j;
    void reset() {
        this->i = -1;
        this->j = -1;
    }
} myMoveNode = {
    i: -1,
    j: -1,
};

enum MY_STATE {
    POLYLINE_STATE,
    DELETE_STATE,
    MOVE_STATE
} myState = POLYLINE_STATE;

void myTransXY(int &x, int &y) {
    x -= config.vp_w;
    y = -y + config.vp_h;
}

float getDis2(P &a, P &b) {
    return (a.first - b.first) * (a.first - b.first) + (a.second - b.second) * (a.second - b.second);
}

void getMin(P p, float &minf, int &iti, int &itj) {
    for (int i = 0; i < myLines.size(); i++) {
        for (int j = 0; j < myLines[i].size(); j++) {
            float dis2 = getDis2(myLines[i][j], p);
            if (dis2 < minf) {
                iti = i;
                itj = j;
                minf = dis2;
            }
        }
    }
}

void delMin(P p) {
    float minf = config.flt_max;
    cout << minf << endl;
    int iti = 0, itj = 0;
    getMin(p, minf, iti, itj);
    if (minf != config.flt_max) {
        cout << "DELETE NODE " << iti << " " << itj << endl;
        myLines[iti].erase(myLines[iti].begin() + itj);
    }
}

void myMouseFunc(int button, int state, int x, int y) {
    myTransXY(x, y);
    if (button == GLUT_LEFT_BUTTON && state == GLUT_UP) {
        if (myState == POLYLINE_STATE) {
            tmpLine.push_back(P(x, y));
            myDisplay();
        }
        if (myState == DELETE_STATE) {
            delMin(P(x,y));
            myDisplay();
        }
        if (myState == MOVE_STATE) {
            cout << "MOVE OVER" << endl;
            myMoveNode.reset();
        }
    }
    if (button == GLUT_LEFT_BUTTON && state == GLUT_DOWN) {
        if (myState == MOVE_STATE) {
            cout << "MOVE BEGIN" << endl;
            float minf = config.flt_max;
            getMin(P(x,y), minf, myMoveNode.i, myMoveNode.j);
            cout << "MOVE NODE " << myMoveNode.i << " " << myMoveNode.j << endl;
        }
    }
}

void myMotionFunc(int x, int y) {
    myTransXY(x, y);
    if (myState == MOVE_STATE) {
        if (myMoveNode.i < 0 || myMoveNode.i >= myLines.size() ||
                myMoveNode.j < 0 || myMoveNode.j >= myLines[myMoveNode.i].size()) {
            myMoveNode.reset();
            return;
        }
        cout << "move " << myLines[myMoveNode.i][myMoveNode.j].first << "," << myLines[myMoveNode.i][myMoveNode.j].second << " to " << x << "," << y <<endl;
        myLines[myMoveNode.i][myMoveNode.j] = P(x, y);
        myDisplay();
    }
}

void myKeyboardFunc(unsigned char key, int x, int y) {
    switch (key) {
    case 'b':
    case 'r':
    case 'd':
    case 'm': {
        if (!tmpLine.empty()) {
            myLines.push_back(tmpLine);
            tmpLine.clear();
        }
        break;
    }
    default:
        break;
    }
    switch (key) {
    case 'b': {
        myState = POLYLINE_STATE;
        cout << "POLYLINE" << endl;
        tmpLine.clear();
        break;
    }
    case 'r': {
        cout << "REFRESH" << endl;
        myDrawInit();
        myDisplay();
        break;
    }
    case 'd': {
        cout << "DELETE" << endl;
        myState = DELETE_STATE;
        break;
    }
    case 'm': {
        cout << "MOVE" << endl;
        myState = MOVE_STATE;
        break;
    }
    case 'q': {
        cout << "QUIT" << endl;
        exit(0);
    }
    default:
        break;
    }
}

void myDrawInit() {
    myLines.clear();
    tmpLine.clear();
    {
        // 房子
        vector<P> v;
        v.push_back(P(-100.0f, -100.0f));
        v.push_back(P(-100.0f, 100.0f));
        v.push_back(P(0.0f, 150.0f));
        v.push_back(P(100.0f, 100.0f));
        v.push_back(P(100.0f, -100.0f));
        v.push_back(P(-100.0f, -100.0f));
        myLines.push_back(v);
    }
    {
        // 左窗户
        vector<P> v;
        v.push_back(P(-60,0));
        v.push_back(P(-60,50));
        v.push_back(P(-10,50));
        v.push_back(P(-10,0));
        v.push_back(P(-60,0));
        myLines.push_back(v);
    }
    {
        // 右窗户
        vector<P> v;
        v.push_back(P(60,0));
        v.push_back(P(60,50));
        v.push_back(P(10,50));
        v.push_back(P(10,0));
        v.push_back(P(60,0));
        myLines.push_back(v);
    }
    {
        vector<P> v;
        v.push_back(P(0.0f + 0.35f*100.0f, 150.0f + 0.35f*(100.0f - 150.0f)));
        v.push_back(P(0.0f + 0.35f*100.0f, 150.0f));
        v.push_back(P(0.0f + 0.65f*100.0f, 150.0f));
        v.push_back(P(0.0f + 0.65f*100.0f, 150.0f + 0.65f*(100.0f - 150.0f)));
        v.push_back(P(0.0f + 0.35f*100.0f, 150.0f + 0.35f*(100.0f - 150.0f)));
        myLines.push_back(v);
    }
}

void myInit() {
    glutInitDisplayMode(GLUT_DEPTH | GLUT_DOUBLE | GLUT_RGB); // 双缓冲
    glutInitWindowSize(config.windows_w, config.windows_h);
    glutCreateWindow(config.windows_title.c_str());
    glClearColor(1.0f, 1.0f, 1.0f, 0.0f);
    glColor3f(.0f, .0f, .0f); // black
    glPointSize(config.point_size);
    glMatrixMode(GL_PROJECTION); // 投影
    glLoadIdentity(); // 矩阵单位化
    gluOrtho2D(config.vp_x, config.vp_w, config.vp_y, config.vp_h);
    glutDisplayFunc(&myDisplay);
    glutMouseFunc(myMouseFunc);
    glutMotionFunc(myMotionFunc);
    glutKeyboardFunc(myKeyboardFunc);
    glEnable(GL_DEPTH_TEST); // 开启深度测试
    myDrawInit();
}

void myDisplay() {
    myLines.push_back(tmpLine);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glPushMatrix();

    for (int i = 0; i < myLines.size(); i++) {
        glBegin(GL_LINE_STRIP);
        for (int j = 0; j < myLines[i].size(); j++) {
            P p = myLines[i][j];
            glVertex2f(p.first, p.second);
        }
        glEnd();
    }

    glFlush();
    glPopMatrix();
    glutSwapBuffers();
    myLines.erase(myLines.end() - 1);
}

void rectDisplay() {
    glClear(GL_COLOR_BUFFER_BIT);
    glRectf(-0.9f, -0.9f, 0.9f, 0.9f);
    glFlush();
}

int main(int argc, char** argv, char** envp) {
    glutInit(&argc, argv);

    myInit();

    glutMainLoop();

    return 0;
}
```
