import * as THREE from 'three';
import * as ORE from 'ore-three-ts';
import { PowerMesh } from '../../PowerMesh';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class World extends THREE.Object3D {

	private commonUniforms: ORE.Uniforms;
	private scene: THREE.Scene;

	private gltfLoader: GLTFLoader;
	private model: THREE.Group | null = null;

	constructor( parentUniforms: ORE.Uniforms, scene: THREE.Scene ) {

		super();

		this.commonUniforms = ORE.UniformsLib.mergeUniforms( parentUniforms, {
		} );

		this.scene = scene;
		this.scene.background = new THREE.Color( "#CCC" );

		/*-------------------------------
			Light
		-------------------------------*/

		let light = new THREE.DirectionalLight();
		light.position.set( 1, 1, 1 );
		this.add( light );

		/*-------------------------------
			glTF Loader
		-------------------------------*/

		this.gltfLoader = new GLTFLoader();

	}

	public loadGLTF( gltfSrc: string ) {

		this.gltfLoader.load( './assets/gltf/2.0/' + gltfSrc, ( gltf ) => {

			if ( this.model ) {

				this.disposeGLTF( this.model );

			}

			this.model = gltf.scene;

			this.model.traverse( obj => {

				let mesh = obj as THREE.Mesh;

				if ( mesh.isMesh ) {

					let powerMesh = new PowerMesh( mesh, {
						uniforms: this.commonUniforms
					} );

					let parent = mesh.parent;

					if ( parent ) {

						parent.add( powerMesh );

					}

					mesh.visible = false;

				}

			} );

			this.add( this.model );


		} );

	}

	private disposeGLTF( gltf: THREE.Group ) {

		gltf.traverse( item => {

			let mesh = item as THREE.Mesh | PowerMesh;

			if ( 'isPowerMesh' in mesh ) {

				mesh.dispose();

			} else if ( mesh.isMesh ) {

				mesh.geometry.dispose();

				let mat = mesh.material as THREE.ShaderMaterial;

				if ( 'isShaderMaterial' in mat ) [

					mat.dispose()

				];

			}

		} );

		this.remove( gltf );

	}

}
