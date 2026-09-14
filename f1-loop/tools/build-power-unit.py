"""Original didactic V6 turbo power unit. Run with Blender 5.2 --background --python.

No manufacturer CAD or third-party geometry. Dimensions are illustrative.
Blender axes: X width, Y crankshaft/length, Z up; glTF exporter converts to Y up.
Slider-crank animation is solved geometrically, not approximated with a sine.
"""
import bpy, math, json, hashlib, os, sys, tempfile, subprocess
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/assets'
ART = Path(os.environ.get('ENGINE_ARTIFACT_DIR', str(Path(tempfile.gettempdir()) / 'inteia-engine-build')))
ART.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.render.fps = 24
scene.frame_start, scene.frame_end = 1, 193
scene['authorship'] = 'Original geometry created for INTEIA; didactic architecture, not manufacturer CAD.'

def material(name, color, metallic=0, rough=.4):
    m = bpy.data.materials.new(name); m.diffuse_color = (*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metallic; p.inputs['Roughness'].default_value=rough
    return m

cast=material('Cast aluminium Â· satin microtexture',(.23,.255,.28),.82,.39)
edge=material('Machined aluminium Â· bright edges',(.58,.62,.66),.93,.22)
steel=material('Forged steel Â· crank and fasteners',(.14,.17,.20),.95,.27)
dark=material('Anodized graphite',(.035,.047,.058),.8,.29)
rubber=material('FKM seals and cable insulation',(.018,.021,.026),.05,.62)
red=material('INTEIA red anodized accents',(.48,.013,.025),.65,.28)
gold=material('Titanium nitride fasteners',(.38,.235,.073),.88,.25)
ceramic=material('Spark plug ceramic',(.81,.8,.74),.05,.27)
heat=[material('Exhaust patina '+str(i),c,.88,.34) for i,c in enumerate([(.30,.19,.09),(.43,.25,.12),(.28,.19,.23),(.13,.18,.27),(.40,.31,.21)])]
carbon=material('Carbon twill Â· original raster weave',(.025,.033,.04),.5,.32)
img=bpy.data.images.new('Original 2x2 twill weave',width=128,height=128)
pixels=[]
for y in range(128):
    for x in range(128):
        warp=((x//8+y//8)%4)<2
        lane=(x%8 if warp else y%8)/7
        v=.022+.044*math.sin(lane*math.pi)**.7 + (.009 if warp else 0)
        pixels.extend((v*.85,v*.96,v,1))
img.pixels=pixels; img.pack()
tex=carbon.node_tree.nodes.new('ShaderNodeTexImage');tex.image=img
carbon.node_tree.links.new(tex.outputs['Color'],carbon.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])

asset=[]
def register(o,name,mat,parent=None):
    o.name=name
    if mat and hasattr(o.data,'materials'): o.data.materials.append(mat)
    if parent: o.parent=parent
    asset.append(o)
    return o
def empty(name,parent=None):
    o=bpy.data.objects.new(name,None);scene.collection.objects.link(o);return register(o,name,None,parent)
assembly=empty('power_unit_v1')
assembly['description']='Original illustrative 90-degree V6, single turbo, MGU-K; no MGU-H.'

def smooth(o):
    if o.type=='MESH':
        for p in o.data.polygons: p.use_smooth=True
    return o
def bevel(o,width=.003,segments=5):
    m=o.modifiers.new('Machined edge radii','BEVEL');m.width=width;m.segments=segments
    m=o.modifiers.new('Weighted surface normals','WEIGHTED_NORMAL');m.keep_sharp=True
    return o
def cube(name,loc,dim,mat,bev=.003,parent=assembly):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object
    o.dimensions=dim;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    register(o,name,mat,parent)
    if bev: bevel(o,bev)
    if mat == carbon and o.data.uv_layers.active:
        for uv in o.data.uv_layers.active.data: uv.uv *= 6
    return smooth(o)
def cyl(name,loc,r,depth,mat,axis=(0,0,1),vertices=40,parent=assembly):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc)
    o=bpy.context.object;o.rotation_mode='QUATERNION';o.rotation_quaternion=Vector(axis).to_track_quat('Z','Y')
    register(o,name,mat,parent);bevel(o,min(.0015,r*.12),2);return smooth(o)
def torus(name,loc,major,minor,mat,axis=(0,0,1),parent=assembly):
    bpy.ops.mesh.primitive_torus_add(major_radius=major,minor_radius=minor,major_segments=40,minor_segments=10,location=loc)
    o=bpy.context.object;o.rotation_mode='QUATERNION';o.rotation_quaternion=Vector(axis).to_track_quat('Z','Y')
    return smooth(register(o,name,mat,parent))
def tube(name,points,r,mat,parent=assembly,sides=12,radii=None):
    pts=[Vector(p) for p in points];verts=[];faces=[]
    for i,p in enumerate(pts):
        tangent=(pts[min(i+1,len(pts)-1)]-pts[max(0,i-1)]).normalized()
        ref=Vector((0,1,0)) if abs(tangent.y)<.95 else Vector((1,0,0))
        u=tangent.cross(ref).normalized();v=tangent.cross(u).normalized();rr=radii[i] if radii else r
        verts += [p+rr*(math.cos(a*2*math.pi/sides)*u+math.sin(a*2*math.pi/sides)*v) for a in range(sides)]
    for i in range(len(pts)-1):
        for j in range(sides):faces.append((i*sides+j,i*sides+(j+1)%sides,(i+1)*sides+(j+1)%sides,(i+1)*sides+j))
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    o=bpy.data.objects.new(name,mesh);scene.collection.objects.link(o);register(o,name,mat,parent);smooth(o)
    return o
def curved(name,control,r,mat,parent=assembly,sides=12):
    cp=[Vector(x) for x in control];pts=[]
    for i in range(len(cp)-1):
        a=cp[max(0,i-1)];b=cp[i];c=cp[i+1];d=cp[min(len(cp)-1,i+2)]
        for j in range(10):
            t=j/10;pts.append(.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t))
    pts.append(cp[-1]);return tube(name,pts,r,mat,parent,sides)
def bolt(name,loc,axis=(0,0,1),scale=1,parent=assembly):
    cyl(name+' washer',loc,.007*scale,.0016*scale,steel,axis,24,parent)
    p=Vector(loc)+Vector(axis)*.0032*scale
    cyl(name+' hex',p,.0049*scale,.005*scale,gold,axis,6,parent)
    cyl(name+' socket',p+Vector(axis)*.0026*scale,.0021*scale,.0002,dark,axis,6,parent)
def plate_label(text,loc,size=.018,rotation=(0,0,0),parent=assembly):
    curve=bpy.data.curves.new('Engraving '+text,'FONT');curve.body=text;curve.size=size;curve.extrude=.00015
    o=bpy.data.objects.new('Engraving '+text,curve);scene.collection.objects.link(o);o.location=loc;o.rotation_euler=rotation
    register(o,o.name,edge,parent)
    bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False)
    return o

# Compact crankcase, deep sump, mounting ears and visible structural ribs.
block=empty('engine_block',assembly)
cube('Crankcase upper casting',(0,0,.28),(.245,.485,.16),cast,.022,block)
cube('Crankcase split flange',(0,0,.213),(.28,.51,.018),edge,.009,block)
cube('Dry sump casting',(0,0,.158),(.218,.425,.095),cast,.025,block)
cube('Dry sump bottom plate',(0,0,.115),(.205,.405,.012),dark,.008,block)
for y in [-.19,-.095,0,.095,.19]:
    cube('Cast transverse sump rib',(0,y,.157),(.231,.009,.07),cast,.004,block)
for s in [-1,1]:
    for y in [-.22,.22]:
        cube('Engine mounting lug',(s*.155,y,.215),(.07,.064,.026),cast,.009,block)
        bolt('Mounting stud',(s*.17,y,.23),scale=1.6,parent=block)
    for y in [-.19,-.10,0,.10,.19]:bolt('Crankcase flange bolt',(s*.128,y,.224),parent=block)
    for y in [-.14,0,.14]:
        cyl('Core plug',(s*.124,y,.29),.022,.004,edge,(s,0,0),32,block)
        cyl('Core plug recess',(s*.128,y,.29),.018,.001,dark,(s,0,0),32,block)

crank_origin=Vector((0,0,.285));r=.0265;L=.105
ys=[-.14,-.126,0,.014,.14,.154]
phases=[0,math.pi/2,2*math.pi/3,7*math.pi/6,4*math.pi/3,11*math.pi/6]
crank=empty('crankshaft',assembly);crank.location=crank_origin
cyl('Crank main shaft',(0,0,0),.020,.51,steel,(0,1,0),48,crank)
for y in [-.21,-.07,.07,.21]:
    cyl('Main bearing journal',(0,y,0),.027,.031,edge,(0,1,0),48,crank)
for i,(y,phase) in enumerate(zip(ys,phases)):
    j=Vector((r*math.sin(phase),y,r*math.cos(phase)))
    cyl('Crankpin '+str(i+1),j,.014,.013,edge,(0,1,0),40,crank)
    for offset in [-.010,.010]:
        o=cube('Forged crank web',(j.x*.38,y+offset,j.z*.38),(.052,.008,.069),steel,.012,crank)
        o.rotation_euler[1]=phase
        cyl('Counterweight boss',(-j.x*.7,y+offset,-j.z*.7),.026,.009,steel,(0,1,0),32,crank)

# Both bank assemblies. A longitudinal cast body is bored by three physical cylinders.
pistons=[];rods=[];axes=[]
for side,sign in [('left',-1),('right',1)]:
    axis=Vector((sign*math.sin(math.pi/4),0,math.cos(math.pi/4)))
    bank=empty('cylinder_bank_'+side,block)
    bankloc=crank_origin+axis*.14
    body=cube('Bored bank casting '+side,bankloc,(.112,.418,.125),cast,.008,bank)
    body.rotation_euler[1]=sign*math.pi/4
    # Apply edge modifiers before the exact bores. They remain separate removable liners.
    bpy.context.view_layer.objects.active=body
    for mod in list(body.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
    for n in range(3):
        y=[-.14,0,.14][n]+(.014 if sign==1 else 0)
        p=crank_origin+axis*.14;p.y=y
        cutter=cyl('Temporary bore',p,.041,.18,None,axis,48,parent=None)
        bpy.context.view_layer.objects.active=body
        mod=body.modifiers.new('Cylinder bore','BOOLEAN');mod.operation='DIFFERENCE';mod.object=cutter
        bpy.ops.object.modifier_apply(modifier=mod.name);asset.remove(cutter);bpy.data.objects.remove(cutter,do_unlink=True)
        tube('Honed cylinder liner '+side+str(n),[p-axis*.061,p+axis*.061],.0407,steel,bank,48)
        torus('Deck fire ring',p+axis*.063,.042,.0014,edge,axis,bank)
    for dy in [-.215,.215]:
        p=bankloc.copy();p.y=dy
        o=cube('Bank end rib '+side,p,(.13,.012,.128),cast,.004,bank);o.rotation_euler[1]=sign*math.pi/4
    head=empty('head_'+side,assembly)
    hp=crank_origin+axis*.225;hp.y=.007
    o=cube('Cylinder head casting '+side,hp,(.151,.449,.073),cast,.011,head);o.rotation_euler[1]=sign*math.pi/4
    o=cube('Head gasket '+side,hp-axis*.038,(.154,.449,.004),dark,.002,head);o.rotation_euler[1]=sign*math.pi/4
    cover=empty('cover_'+side,assembly)
    cp=hp+axis*.050
    o=cube('CNC cam cover '+side,cp,(.147,.447,.045),dark,.018,cover);o.rotation_euler[1]=sign*math.pi/4
    o=cube('Cam cover perimeter rim '+side,cp-axis*.016,(.153,.454,.011),edge,.013,cover);o.rotation_euler[1]=sign*math.pi/4
    # Recessed machined strips follow each cover edge, with cap screws.
    lateral=Vector((math.cos(math.pi/4),0,-sign*math.sin(math.pi/4)))
    for offset in [-.054,.054]:
        sp=cp+lateral*offset+axis*.024
        o=cube('Machined cam rail '+side,sp,(.007,.378,.004),edge,.002,cover);o.rotation_euler[1]=sign*math.pi/4
        for y in [-.19,-.065,.07,.20]:
            p=cp+lateral*offset+axis*.026;p.y=y;bolt('Cam cover screw',p,axis,.75,cover)
    for n,y in enumerate([-.14,.0,.14]):
        p=cp+axis*.029;p.y=y+(.014 if sign==1 else 0)
        cyl('Ignition coil '+side+str(n),p,.018,.027,dark,axis,32,cover)
        cyl('Spark plug porcelain '+side+str(n),p-axis*.065,.006,.032,ceramic,axis,24,head)
        cyl('Spark plug threaded shell',p-axis*.09,.007,.024,steel,axis,24,head)
        curved('Ignition lead '+side+str(n),[p+axis*.018,p+axis*.025+Vector((0,.018,0)),(sign*.14,.255,.52),(sign*.10,.29,.36)],.0027,rubber,assembly,8)

for i in range(6):
    sign=-1 if i%2==0 else 1
    axis=Vector((sign/math.sqrt(2),0,1/math.sqrt(2)));axes.append(axis)
    piston=empty('piston_%02d'%(i+1),assembly)
    piston.rotation_mode='QUATERNION';piston.rotation_quaternion=axis.to_track_quat('Z','Y')
    cyl('Piston skirt %02d'%(i+1),(0,0,.006),.039,.046,edge,vertices=48,parent=piston)
    cyl('Piston crown %02d'%(i+1),(0,0,.032),.0395,.009,edge,vertices=48,parent=piston)
    cyl('Crown recessed bowl',(0,0,.0366),.023,.0003,cast,vertices=40,parent=piston)
    for z in [.017,.023,.029]:torus('Piston compression ring',(0,0,z),.0393,.0008,steel,parent=piston)
    cyl('Wrist pin',(0,0,0),.009,.081,steel,(0,1,0),32,piston)
    for y in [-.041,.041]:torus('Wrist pin circlip',(0,y,0),.009,.001,dark,(0,1,0),piston)
    pistons.append(piston)
    rod=empty('connecting_rod_%02d'%(i+1),assembly);rod.rotation_mode='QUATERNION'
    torus('Rod big end',(0,0,0),.018,.006,steel,(0,1,0),rod)
    torus('Rod small end',(0,0,L),.009,.004,steel,(0,1,0),rod)
    cube('Forged rod I beam',(0,0,L*.49),(.012,.011,L-.026),steel,.003,rod)
    for y in [-.0055,.0055]:cube('Rod beam flange',(0,y,L*.49),(.019,.003,L-.033),edge,.002,rod)
    for x in [-.019,.019]:cyl('Rod cap bolt',(x,0,0),.0035,.02,steel,(0,0,1),12,rod)
    rods.append(rod)

# Timing gear train, damper, drilled flywheel and machined bell housing interface.
cyl('Front timing case',(0,-.266,.326),.123,.028,cast,(0,1,0),64)
cyl('Timing cover inset',(0,-.283,.326),.108,.009,dark,(0,1,0),64)
for a in range(12):
    t=a*math.pi/6;bolt('Timing cover fastener',(.11*math.sin(t),-.292,.326+.11*math.cos(t)),(0,-1,0),.85)
cyl('crank_damper',(0,-.305,.285),.063,.022,dark,(0,1,0),64)
torus('Damper machined ring',(0,-.32,.285),.056,.004,edge,(0,1,0))
cyl('Flywheel',(0,.275,.285),.096,.018,steel,(0,1,0),64)
for a in range(48):
    t=a*2*math.pi/48;o=cube('Starter ring tooth',(.098*math.sin(t),.275,.285+.098*math.cos(t)),(.007,.022,.006),edge,.001);o.rotation_euler[1]=t
for a in range(8):
    t=a*math.pi/4;cyl('Flywheel lightening pocket',(.073*math.sin(t),.286,.285+.073*math.cos(t)),.009,.001,dark,(0,1,0),20)

# Carbon intake plenum, bonded seam and six curved individual runners.
plenum=empty('intake_plenum',assembly)
cube('Carbon monocoque plenum',(0,-.015,.625),(.215,.429,.107),carbon,.048,plenum)
cube('Plenum bonded seam',(0,-.015,.61),(.22,.435,.008),dark,.035,plenum)
for i in range(6):
    sign=-1 if i%2==0 else 1;y=ys[i]
    curved('intake_runner_%02d'%(i+1),[(sign*.075,y,.594),(sign*.082,y,.54),(sign*.135,y,.499),(sign*.172,y,.469)],.019,carbon,plenum,16)
    torus('Runner sealing band',(sign*.172,y,.469),.02,.0026,edge,(sign*.707,0,-.707),plenum)
curved('Charge air duct',[(0,.19,.633),(0,.285,.633),(.015,.373,.597),(.025,.414,.535)],.036,carbon,assembly,20)
for y in [.19,.28]:torus('Charge pipe clamp',(0,y,.633),.037,.0028,edge,(0,1,0))
plate_label('INTEIA  /  V6',( -.070,-.09,.680),.018)
plate_label('DIDACTIC  POWER  UNIT',(-.074,-.12,.680),.009)

# Six individually formed exhaust runners feed a rear collector. Heat tint is material bands.
for i in range(6):
    sign=-1 if i%2==0 else 1;y=ys[i]
    start=(sign*.227,y,.416);exit=(sign*.075,.384,.46)
    o=curved('exhaust_header_%02d'%(i+1),[start,(sign*.30,y,.407),(sign*(.32+(.02 if i<2 else 0)),y+.08,.365),(sign*.285,.285,.407),exit],.0165,heat[0],assembly,16)
    for m in heat[1:]:o.data.materials.append(m)
    for poly in o.data.polygons:poly.material_index=(poly.index//64+i)%len(heat)
    torus('Exhaust port flange',start,.021,.004,steel,(sign,0,0))
    for z in [-.028,.028]:bolt('Header flange stud',(sign*.227,y,.416+z),(sign,0,0),.7)
    for j,p in enumerate([(sign*.30,y,.407),(sign*.285,.285,.407)]):torus('Weld bead '+str(i)+str(j),p,.017,.0008,edge,(0,1,0))
curved('Twin exhaust collector',[(-.075,.384,.46),(0,.4,.446),(.065,.399,.456)],.030,heat[1],assembly,20)

turbo=empty('turbo',assembly)
tc=Vector((0,.45,.46))
for part,yy,mat in [('turbine',-.022,heat[1]),('compressor',.068,cast)]:
    center=tc+Vector((0,yy,0));pts=[];rr=[]
    for j in range(91):
        t=j/90;ang=t*2*math.pi*.94
        radius=.056+.027*t;pts.append(center+Vector((radius*math.sin(ang),0,radius*math.cos(ang))));rr.append(.018+.012*t)
    tube(part+'_volute',pts,.025,mat,turbo,20,rr)
    cyl(part+'_backplate',center,.088,.014,steel,(0,1,0),64,turbo)
    torus(part+'_case_band',center,.087,.003,edge,(0,1,0),turbo)
    for a in range(8):
        angle=a*math.pi/4;bolt(part+' perimeter bolt',center+Vector((.085*math.sin(angle),.01,.085*math.cos(angle))),(0,1,0),.6,turbo)
cyl('Turbo center bearing cartridge',tc+Vector((0,.028,0)),.025,.075,steel,(0,1,0),40,turbo)
inlet=tc+Vector((0,.095,0))
tube('Compressor inlet bellmouth',[inlet,inlet+Vector((0,.035,0)),inlet+Vector((0,.052,0))],.045,edge,turbo,48,[.039,.044,.053])
torus('Inlet rolled lip',inlet+Vector((0,.052,0)),.053,.003,edge,(0,1,0),turbo)
cyl('compressor_impeller_hub',inlet,.014,.038,edge,(0,1,0),40,turbo)
for i in range(12):
    a=i*math.pi/6;pts=[]
    for j in range(12):
        t=j/11;ang=a+.52*t;pts.append(inlet+Vector(((.014+.024*t)*math.sin(ang),.018-.019*t,(.014+.024*t)*math.cos(ang))))
    tube('Compressor swept blade %02d'%i,pts,.0014,edge,turbo,6)
curved('Turbine exhaust outlet',[(0,.428,.46),(0,.46,.38),(0,.54,.34),(0,.615,.345)],.032,heat[2],assembly,24)
torus('Exhaust exit rolled edge',(0,.615,.345),.032,.002,edge,(0,1,0))
curved('Turbo oil feed',[(.03,.445,.465),(.078,.34,.51),(.075,.265,.36)],.0035,steel,assembly,8)
curved('Turbo oil return',[(0,.444,.434),(.065,.355,.22),(.08,.17,.17)],.0075,dark,assembly,10)
cyl('Wastegate actuator',(-.13,.425,.47),.026,.052,dark,(1,0,0),40)
curved('Wastegate linkage',[(-.105,.425,.47),(-.062,.417,.468),(-.053,.433,.435)],.0025,steel,assembly,8)

# MGU-K only: separate side-mounted electrical machine, fins, gearbox and HV interlock.
mgu=empty('mgu_k',assembly)
cyl('MGU-K casing',(.215,.065,.221),.066,.209,dark,(0,1,0),64,mgu)
for y in [-.045,.17]:
    cyl('MGU-K end bell',(.215,y,.221),.064,.016,cast,(0,1,0),48,mgu)
    for a in range(6):
        t=a*math.pi/3;bolt('MGU-K end fastener',(.215+.052*math.sin(t),y+.01,.221+.052*math.cos(t)),(0,1,0),.7,mgu)
for a in range(20):
    t=a*math.pi/10;o=cube('MGU-K cooling fin',(.215+.064*math.sin(t),.064,.221+.064*math.cos(t)),(.005,.181,.012),cast,.0015,mgu);o.rotation_euler[1]=t
cube('MGU-K reduction case',(.164,-.096,.236),(.17,.057,.12),cast,.02,mgu)
cube('HV connector lock',(.25,.151,.293),(.045,.058,.027),red,.005,mgu)
curved('HV orange shielded cable',[(.25,.15,.305),(.30,.215,.30),(.22,.29,.25),(.12,.285,.20)],.0075,material('High voltage insulation',(.56,.105,.008),.0,.5),assembly,12)
for y in [-.04,.07,.17]:torus('MGU-K housing seam',(.215,y,.221),.066,.0016,edge,(0,1,0),mgu)

# Auxiliary pumps, braided lines, connectors, machined fuel rail and fastener detail.
cyl('Dry sump scavenge pump',(-.172,-.04,.181),.033,.265,cast,(0,1,0),40)
for y in [-.13,-.07,0,.07]:torus('Scavenge pump stage',(-.172,y,.181),.034,.003,edge,(0,1,0))
curved('Coolant crossover',[(-.20,-.20,.46),(-.24,-.278,.40),(0,-.32,.41),(.24,-.278,.40),(.20,-.20,.46)],.0125,dark,assembly,16)
for sign in [-1,1]:
    cyl('Fuel rail',(sign*.18,0,.54),.008,.412,edge,(0,1,0),24)
    for y in [-.14,0,.14]:
        cyl('Injector fitting',(sign*.18,y,.52),.009,.038,steel,vertices=12)
        bolt('Fuel rail clamp',(sign*.18,y+.018,.545),scale=.65)
    curved('Braided supply line',[(sign*.18,.205,.54),(sign*.22,.26,.57),(sign*.12,.285,.56),(sign*.10,.31,.46)],.005,steel,assembly,10)
cube('Sensor control module',(-.14,.226,.36),(.105,.027,.064),dark,.007)
for x in [-.17,-.14,-.11]:cube('Sensor connector',(x,.249,.36),(.018,.025,.028),rubber,.003)

# Exact slider-crank constraint, sampled slowly over two four-stroke cycles (four turns).
max_rod_error=0
for frame in range(1,194):
    theta=(frame-1)/192*8*math.pi
    crank.rotation_euler=(0,theta,0);crank.keyframe_insert('rotation_euler',frame=frame)
    for i,(piston,rod,axis) in enumerate(zip(pistons,rods,axes)):
        a=theta+phases[i];journal=Vector((r*math.sin(a),0,r*math.cos(a)))
        projection=journal.dot(axis)
        distance=projection+math.sqrt(L*L-r*r+projection*projection)
        pin=axis*distance;base=crank_origin+Vector((0,ys[i],0))
        piston.location=base+pin;piston.keyframe_insert('location',frame=frame)
        rod.location=base+journal;rod.rotation_quaternion=(pin-journal).to_track_quat('Z','Y')
        rod.keyframe_insert('location',frame=frame);rod.keyframe_insert('rotation_quaternion',frame=frame)
        max_rod_error=max(max_rod_error,abs((pin-journal).length-L))
for o in [crank]+pistons+rods:
    action=o.animation_data.action
    # Matching NLA track names merge the independently moving semantic nodes into one glTF clip.
    action.name=o.name+'_running'
    for layer in action.layers:
        for strip in layer.strips:
            for slot in action.slots:
                bag=strip.channelbag(slot)
                if bag:
                    for fc in bag.fcurves:
                        for k in fc.keyframe_points:k.interpolation='LINEAR'
    track=o.animation_data.nla_tracks.new();track.name='running'
    track.strips.new(action.name,1,action);o.animation_data.action=None
scene.frame_set(1)

# Semantic, origin-stable assemblies for a controlled exploded view in the lesson.
# Animation paths remain on the moving nodes; moving these groups preserves their mechanism.
groups={key:empty('assembly_'+key,assembly) for key in ['block','head_left','head_right','intake','exhaust_left','exhaust_right','turbo','electric','rotating']}
for o in list(asset):
    if o.parent != assembly or o in groups.values(): continue
    name=o.name.lower();key='block'
    if name=='crankshaft' or name.startswith(('piston_','connecting_rod_')):key='rotating'
    elif name in ['head_left','cover_left']:key='head_left'
    elif name in ['head_right','cover_right']:key='head_right'
    elif name=='intake_plenum' or name.startswith(('charge air','charge pipe','engraving')):key='intake'
    elif name.startswith(('exhaust_header_','exhaust port','header flange','weld bead')):
        key='exhaust_left' if o.location.x<0 else 'exhaust_right'
        if name.startswith('exhaust_header_'):key='exhaust_left' if int(name.rsplit('_',1)[1])%2 else 'exhaust_right'
    elif name.startswith(('turbo','twin exhaust','turbine exhaust','exhaust exit','wastegate')):key='turbo'
    elif name=='mgu_k' or name.startswith('hv orange'):key='electric'
    world=o.matrix_world.copy();o.parent=groups[key];o.matrix_world=world

# Join by render assembly and material, never across a moving mechanism or exploded group.
# All semantic empty nodes survive. The high-detail source remains reproducible from this script.
render_roots=set(groups.values()) | set(pistons) | set(rods) | {crank}
batches={}
for o in list(assembly.children_recursive):
    if o.type!='MESH':continue
    parent=o.parent
    while parent not in render_roots and parent is not None:parent=parent.parent
    if parent is None:raise RuntimeError('Mesh without semantic render group: '+o.name)
    bpy.context.view_layer.objects.active=o
    for mod in list(o.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
    for slot in o.material_slots:
        if slot.material is None:slot.material=cast
    key=(parent,tuple(m.name for m in o.data.materials))
    batches.setdefault(key,[]).append(o)
for (parent,mats),objects in batches.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects:o.select_set(True)
    bpy.context.view_layer.objects.active=objects[0]
    bpy.ops.object.join();joined=bpy.context.object
    world=joined.matrix_world.copy();joined.parent=parent;joined.matrix_world=world
    joined.name='render_'+parent.name+'_'+mats[0].split(' Â· ')[0]
asset=[assembly]+list(assembly.children_recursive)

# Export only the power unit; rendering furniture, lights and camera stay outside the GLB.
bpy.ops.object.select_all(action='DESELECT')
for o in asset:
    if o.name in bpy.data.objects:o.select_set(True)
bpy.context.view_layer.objects.active=assembly
glb=OUT/'power-unit-v1.glb'
bpy.ops.export_scene.gltf(filepath=str(glb),use_selection=True,export_format='GLB',export_apply=True,
    export_yup=True,export_animations=True,export_animation_mode='NLA_TRACKS',
    export_force_sampling=True,export_frame_range=True,export_frame_step=1,
    export_image_format='AUTO',export_materials='EXPORT',export_cameras=False,export_lights=False)
if os.environ.get('F1_ASSET_TOOL_ROOT'):
    (ART/'power-unit-v1-joined-uncompressed.glb').write_bytes(glb.read_bytes())
    env=dict(os.environ);env['ENGINE_GLB']=str(glb)
    subprocess.run(['node',str(ROOT/'tools/optimize-power-unit.mjs')],check=True,env=env)

# Manifest measured from the exported container; not guessed from source primitives.
raw=glb.read_bytes();chunklen=int.from_bytes(raw[12:16],'little');gltf=json.loads(raw[20:20+chunklen])
triangles=sum(gltf['accessors'][p['indices']]['count']//3 for m in gltf.get('meshes',[]) for p in m['primitives'] if 'indices' in p)
deps=bpy.context.evaluated_depsgraph_get();coords=[]
for o in asset:
    if o.type=='MESH':
        ev=o.evaluated_get(deps);coords.extend([ev.matrix_world@Vector(c) for c in ev.bound_box])
lo=[min(v[i] for v in coords) for i in range(3)];hi=[max(v[i] for v in coords) for i in range(3)]
manifest={'name':'Original didactic V6 turbo power unit','version':1,'authorship':'Original procedural geometry authored for INTEIA; no downloaded CAD or manufacturer replica.',
 'scope':'Illustrative 90-degree V6 turbo architecture with MGU-K and no MGU-H; not engineering or homologation data.',
 'units':'metres','axes':'glTF Y up, longitudinal Z','blender_bbox':{'min':lo,'max':hi},'gltf_dimensions_xyz':[hi[0]-lo[0],hi[2]-lo[2],hi[1]-lo[1]],
 'meshes':len(gltf.get('meshes',[])),'nodes':len(gltf.get('nodes',[])),'triangles':triangles,'materials':len(gltf.get('materials',[])),
 'render_primitives':sum(len(m['primitives']) for m in gltf.get('meshes',[])),
 'extensions_required':gltf.get('extensionsRequired',[]),
 'animations':[{'name':a.get('name'),'channels':len(a.get('channels',[])), 'duration_seconds':max(gltf['accessors'][s['input']]['max'][0] for s in a['samplers'])} for a in gltf.get('animations',[])],
 'mechanism':{'crank_radius_m':r,'rod_length_m':L,'stroke_m':2*r,'bank_angles_deg':[-45,45],'clip_seconds':8,'crank_turns':4,'four_stroke_cycles':2,'max_sampled_rod_length_error_m':max_rod_error,'note':'Slider-crank kinematics only. No combustion, valve timing, energy flow or manufacturer firing-order claim.'},
 'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
 'optimizer_sha256':hashlib.sha256((ROOT/'tools/optimize-power-unit.mjs').read_bytes()).hexdigest(),
 'license':'CC BY 4.0; credit INTEIA for the original illustrative geometry.'}
(OUT/'power-unit-v1.manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False),encoding='utf-8')

# Studio still: CPU only and bounded thread count, safe beside the other GPU review.
floor=material('Studio ground',(.015,.02,.026),.25,.4)
cube('Render pedestal',(0,.10,.038),(.89,1.12,.06),floor,.022,parent=None)
bpy.ops.object.camera_add(location=(1.12,1.40,1.03));cam=bpy.context.object
target=Vector((0,.12,.39));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=1.35;scene.camera=cam
def light(name,loc,energy,size,color):
    bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=energy;o.data.shape='DISK';o.data.size=size;o.data.color=color;o.rotation_euler=(Vector((0,.08,.38))-o.location).to_track_quat('-Z','Y').to_euler()
light('Large warm key',(1.0,-.6,1.8),260,1.5,(1,.88,.76))
light('Cool rim',(-.9,.7,1.1),320,1.2,(.60,.76,1))
light('Front machinery fill',(.3,1.3,.8),170,1.0,(1,1,1))
scene.world.use_nodes=True
scene.world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.025,.03,.038,1)
scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.3
scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=48
scene.cycles.use_denoising=True;scene.render.threads_mode='FIXED';scene.render.threads=6
scene.render.resolution_x=1400;scene.render.resolution_y=1200;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast';scene.view_settings.exposure=-.6;scene.render.image_settings.file_format='PNG'
scene.render.filepath=str(ART/'power-unit-v1-studio.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ART/'power-unit-v1.blend'))
bpy.ops.render.render(write_still=True)
print('POWER_UNIT_MANIFEST '+json.dumps(manifest))
