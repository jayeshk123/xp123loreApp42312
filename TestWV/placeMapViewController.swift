//
//  placeMapViewController.swift
//  TestWV
//
//  Created by earth on 14/09/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Mapbox
import GRDB
import NVActivityIndicatorView
import MapboxDirections
import MapboxNavigation
import Alamofire
import SwiftyJSON
import Toaster

class placeMapViewController: UIViewController,MGLMapViewDelegate {

    @IBOutlet var mapView: MGLMapView!
    var URL = "http://34.231.31.72/xplore/index.php"
    var dbQueue: DatabaseQueue!

    override func viewDidLoad() {
        super.viewDidLoad()
        setUpDatabasePath()
        mapView = MGLMapView(frame: view.bounds, styleURL: MGLStyle.lightStyleURL())
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        //mapView.tintColor = .gray
        mapView.delegate = self
        mapView.logoView.isHidden = true
        mapView.attributionButton.isHidden = true
        //mainFrameMapView.addSubview(mapView)
        view.addSubview(mapView)

        
        getPlaceDetails()
        
        // Do any additional setup after loading the view.
    }
    
    public func getPlaceDetails(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM placeProfile")
                while let row = try rows.next() {
                    let sectionIndex: String = row.value(named: "uniqueID")
                    let name: String = row.value(named: "name")
                    let address: String = row.value(named: "address")
                    let lattitude: String = row.value(named: "lattitude")
                    let longitude: String = row.value(named: "longitude")
                    print(sectionIndex)
                    
                    let lat = (lattitude as NSString).floatValue
                    let long = (longitude as NSString).floatValue
                    print(lat)
                    print(long)
                    let hello = MGLPointAnnotation()
                    hello.coordinate = CLLocationCoordinate2D(latitude: CLLocationDegrees(lat) , longitude: CLLocationDegrees(long))
                    hello.title = name
                    hello.subtitle = address
                    
                    mapView.addAnnotation(hello)
                    
                    let center = CLLocationCoordinate2D(latitude: CLLocationDegrees(lat), longitude: CLLocationDegrees(long))
                    mapView.setCenter(center, zoomLevel: 12, animated: false)
                    view.addSubview(mapView)
                    
                }
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }
    
    
    
    func setUpDatabasePath()
    {
        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first! as NSString
        let databasePath = documentsPath.appendingPathComponent("sqliteDB.sqlite")
        print("DATABASE PATH !!!!")
        print(databasePath)
        let fileManager:FileManager = FileManager.default
        var success = fileManager.fileExists(atPath: databasePath)
        if (success)
        {
            dbQueue = try! DatabaseQueue(path: databasePath)
            print("writing to documents directory")
            print(databasePath)
            //break
            return
        }
        if (!success)
        {
            let bundlePath = Bundle.main.path(forResource: "sqliteDB", ofType: "sqlite")
            success = fileManager.fileExists(atPath: bundlePath!)
            print("writing from app bundle")
            if (success)
            {
                try! fileManager.copyItem(atPath: bundlePath!, toPath: databasePath)
                dbQueue = try! DatabaseQueue(path: databasePath)
            }
            else
            {
                print("Could not find database")
            }
            return
        }
    }
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
